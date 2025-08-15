/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/cognitive/slide";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";
import useWindowMock from "support/hooks/use-window-mock";
import assessment from "support/data/assessment/cognitive/incomplete";

const defaultQuestions = assessment.questions.slice(1, 3);
const loadedQuestions = defaultQuestions.map((question) => ({...question, loaded: true}));

describe("Slide", () => {
  let component;
  let originalDate;
  let props;

  useContainer();

  beforeAll(() => {
    originalDate = Date.now;
  });

  beforeEach(() => {
    const now = Date.now();
    Date.now = jest.fn().mockName("now").mockReturnValue(now);

    props = {
      onSelect: jest.fn().mockName("onSelect"),
      question: loadedQuestions[0],
      translate: jest.fn().mockName("translate").mockImplementation((value) => value)
    };
  });

  afterAll(() => {
    Date.now = originalDate;
  });

  describe("setup", () => {
    beforeEach(async() => {
      component = await ComponentHandler.setup(Component, {props});
    });

    it("disables confirm button", () => {
      const button = component.instance.findAllByType("button")
        .find((element) => element.children[0] === "cognitive_confirm_button");

      expect(button.props.disabled).toBe(true);
      expect(button.props.onClick).toBeNull();
    });

    it("sets start time", () => {
      expect(Date.now).toHaveBeenCalled();
    });
  });

  describe("skip", () => {
    useWindowMock("confirm");

    it("calls select", async() => {
      window.confirm.mockReturnValue(true);
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      act(() => component.findByText("cognitive_skip_button").props.onClick());

      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(props.onSelect).toHaveBeenCalledWith({skipped: true, timeTaken: 2000});
    });

    it("calls skip if present", async() => {
      props.onSkip = jest.fn().mockName("onSkip");
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      act(() => component.findByText("cognitive_skip_button").props.onClick());

      expect(window.confirm).not.toHaveBeenCalled();
      expect(props.onSelect).not.toHaveBeenCalled();
      expect(props.onSkip).toHaveBeenCalledWith({timeTaken: 2000});
    });

    it("does nothing if not confirmed", async() => {
      window.confirm.mockReturnValue(false);
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      act(() => component.findByText("cognitive_skip_button").props.onClick());

      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(props.onSelect).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    let button;

    beforeEach(async() => {
      component = await ComponentHandler.setup(Component, {props});
      props.onSelect.mockImplementation(() => (
        component.updateProps({question: loadedQuestions[1]})
      ));
      act(() => component.instance.findAllByProps({className: "choice"})[0].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      Date.now.mockClear();
      act(() => component.findByText("cognitive_confirm_button").props.onClick());
      button = component.findByText("cognitive_confirm_button");
    });

    it("disables confirm button", () => {
      expect(button.props.disabled).toBe(true);
      expect(button.props.onClick).toBeNull();
    });

    it("resets start time", () => {
      expect(Date.now).toHaveBeenCalled();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading", async() => {
    props.question = defaultQuestions[0];
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("submits selected answer", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => (
      component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick()
    ));
    Date.now.mockReturnValue(Date.now() + 2000);
    act(() => component.findByText("cognitive_confirm_button").props.onClick());

    expect(props.onSelect).toHaveBeenCalledWith({
      answerId: props.question.responses[1].id,
      timeTaken: 2000
    });
  });
});
