import Component from "components/slide-deck/cognitive/slide";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/cognitive.json";
import {useWindowMock} from "support/mocks";

const defaultQuestions = assessment.questions.slice(1, 3);
const loadedQuestions = defaultQuestions.map((question) => ({...question, loaded: true}));

describe("Slide", () => {
  let originalDate;
  let props;

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
    let component;

    beforeEach(() => {
      component = new ComponentHandler(<Component {...props} />);
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

    it("calls select", () => {
      window.confirm.mockReturnValue(true);
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      component.act(() => component.findByText("cognitive_skip_button").props.onClick());

      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(props.onSelect).toHaveBeenCalledWith({skipped: true, timeTaken: 2000});
    });

    it("calls skip if present", () => {
      props.onSkip = jest.fn().mockName("onSkip");
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      component.act(() => component.findByText("cognitive_skip_button").props.onClick());

      expect(window.confirm).not.toHaveBeenCalled();
      expect(props.onSelect).not.toHaveBeenCalled();
      expect(props.onSkip).toHaveBeenCalledWith({timeTaken: 2000});
    });

    it("does nothing if not confirmed", () => {
      window.confirm.mockReturnValue(false);
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      component.act(() => component.findByText("cognitive_skip_button").props.onClick());

      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(props.onSelect).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    let button;
    let component;

    beforeEach(() => {
      component = new ComponentHandler(<Component {...props} />);
      props.onSelect.mockImplementation(() => (
        component.updateProps({question: loadedQuestions[1]})
      ));
      component.act(() => component.instance.findAllByProps({className: "choice"})[0].children[0].props.onClick());
      Date.now.mockReturnValue(Date.now() + 2000);
      Date.now.mockClear();
      component.act(() => component.findByText("cognitive_confirm_button").props.onClick());
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

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading", () => {
    props.question = defaultQuestions[0];
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("submits selected answer", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => (
      component.instance.findAllByProps({className: "choice"})[1].children[0].props.onClick()
    ));
    Date.now.mockReturnValue(Date.now() + 2000);
    component.act(() => component.findByText("cognitive_confirm_button").props.onClick());

    expect(props.onSelect).toHaveBeenCalledWith({
      answerId: props.question.responses[1].id,
      timeTaken: 2000
    });
  });
});
