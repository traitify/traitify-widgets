import Component from "components/slide-deck/cognitive/timer";
import ComponentHandler from "support/component-handler";
import {useWindowMock} from "support/mocks";

describe("Timer", () => {
  let originalDate;
  let props;

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

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders component with no time remaining", () => {
    props.startTime -= (props.timeAllowed + 10) * 1000;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).toHaveBeenCalled();
  });

  it("renders component with time passed", () => {
    props.startTime -= 1234;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("sets time left", () => {
    new ComponentHandler(<Component {...props} />);

    expect(Date.now).toHaveBeenCalled();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("submits", () => {
    props.startTime -= props.timeAllowed * 1000;
    new ComponentHandler(<Component {...props} />);

    expect(props.onFinish).toHaveBeenCalled();
  });

  it("updates component after 1 second", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    Date.now.mockReturnValue(Date.now() + 1000);
    component.act(() => setTimeout.mock.calls[0][0]());

    expect(component.tree).toMatchSnapshot();
  });
});
