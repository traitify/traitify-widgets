/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/cognitive/timer";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";
import useWindowMock from "support/hooks/use-window-mock";

describe("Timer", () => {
  let component;
  let originalDate;
  let props;

  useContainer();
  useWindowMock("setTimeout");

  beforeAll(() => {
    originalDate = Date.now;
  });

  beforeEach(() => {
    const now = Date.now();
    Date.now = jest.fn().mockName("now").mockReturnValue(now);

    props = {
      onFinish: jest.fn().mockName("onFinish"),
      startTime: now,
      timeAllowed: 1500
    };
  });

  afterAll(() => {
    Date.now = originalDate;
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders component with no time remaining", async() => {
    props.startTime -= (props.timeAllowed + 10) * 1000;
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).toHaveBeenCalled();
  });

  it("renders component with time passed", async() => {
    props.startTime -= 1234;
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("sets time left", async() => {
    await ComponentHandler.setup(Component, {props});

    expect(Date.now).toHaveBeenCalled();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("submits", async() => {
    props.startTime -= props.timeAllowed * 1000;
    await ComponentHandler.setup(Component, {props});

    expect(props.onFinish).toHaveBeenCalled();
  });

  it("updates component after 1 second", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    Date.now.mockReturnValue(Date.now() + 1000);
    act(() => setTimeout.mock.calls[0][0]());

    expect(component.tree).toMatchSnapshot();
  });
});
