/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/cognitive/timer";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

describe("Timer", () => {
  let component;
  let props;

  useContainer();

  beforeEach(() => {
    jest.spyOn(Date, "now");
    jest.spyOn(global, "setTimeout");

    props = {
      onFinish: jest.fn().mockName("onFinish"),
      startTime: Date.now(),
      timeAllowed: 1500
    };
  });

  it("renders component", () => {
    component = ComponentHandler.render(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders component with no time remaining", () => {
    props.startTime -= (props.timeAllowed + 10) * 1000;
    component = ComponentHandler.render(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).toHaveBeenCalled();
  });

  it("renders component with time passed", () => {
    props.startTime -= 1234;
    component = ComponentHandler.render(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("sets time left", () => {
    ComponentHandler.render(Component, {props});

    expect(Date.now).toHaveBeenCalled();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("submits", () => {
    props.startTime -= props.timeAllowed * 1000;
    ComponentHandler.render(Component, {props});

    expect(props.onFinish).toHaveBeenCalled();
  });

  it("updates component after 1 second", () => {
    component = ComponentHandler.render(Component, {props});
    act(() => { jest.advanceTimersByTime(1000); });

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(component.tree).toMatchSnapshot();
  });
});
