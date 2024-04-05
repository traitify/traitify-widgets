/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import {defaultExplanations, defaultQuestions} from "components/survey/cognitive/instructions-defaults";
import Component from "components/survey/cognitive/practice";
import Slide from "components/survey/cognitive/slide";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";
import useResizeMock from "support/hooks/use-resize-mock";
import useWindowMock from "support/hooks/use-window-mock";

jest.mock("components/survey/cognitive/slide", () => (() => <div className="mock">Slide</div>));

const selectAnswer = ({component, index}) => {
  const {onSelect, question} = component.instance.findByType(Slide).props;

  onSelect({answerId: question.responses[index].id, timeTaken: 200});
};

describe("Practice", () => {
  let component;
  let props;

  useContainer();

  beforeEach(() => {
    props = {
      onFinish: jest.fn().mockName("onFinish"),
      practiceExplanations: defaultExplanations,
      practiceQuestions: defaultQuestions,
      translate: jest.fn().mockName("translate").mockImplementation((value) => value)
    };
  });

  describe("actions", () => {
    useWindowMock("alert");

    it("finishes", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => selectAnswer({component, index: 3}));
      act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
      act(() => selectAnswer({component, index: 3}));
      act(() => component.findByText("cognitive_practice_step_2_button").props.onClick());
      act(() => selectAnswer({component, index: 3}));
      act(() => component.findByText("cognitive_practice_step_3_button").props.onClick());

      expect(component.tree).toMatchSnapshot();
      expect(props.onFinish).toHaveBeenCalled();
    });

    it("doesn't skip", async() => {
      component = await ComponentHandler.setup(Component, {props});
      component.instance.findByType(Slide).props.onSkip();

      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe("videos", () => {
    useResizeMock();

    describe("horizontal", () => {
      beforeEach(async() => {
        act(() => window.resizeTo(1200, 800));
        component = await ComponentHandler.setup(Component, {props});
        act(() => selectAnswer({component, index: 0}));
      });

      it("renders component", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("updates to vertical", () => {
        act(() => window.resizeTo(600, 800));

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("vertical", () => {
      beforeEach(async() => {
        act(() => window.resizeTo(600, 800));
        component = await ComponentHandler.setup(Component, {props});
        act(() => selectAnswer({component, index: 0}));
      });

      it("renders component", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("updates to horizontal", () => {
        act(() => window.resizeTo(1200, 800));

        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  it("renders custom questions", async() => {
    props.practiceExplanations = [
      {button: "First Button", heading: "First Heading", text: "First Text"},
      {
        button: "Second Button",
        heading: "Second Heading",
        text: "Second Text",
        video: "https://cdn.traitify.com/images/cognitive/practice-example-h.mp4"
      }
    ];
    props.practiceQuestions = [1, 3].map((answer, index) => ({
      correctAnswerID: `r-${index}-${answer}`,
      id: `s-${index}`,
      questionImage: {url: `https://cdn.traitify.com/images/cognitive/practice-question-${index + 1}/question.png`},
      responses: [1, 2, 3, 4].map((response) => ({
        id: `r-${index}-${response}`,
        image: {url: `https://cdn.traitify.com/images/cognitive/practice-question-${index + 1}/response-${response}.png`}
      }))
    }));

    component = await ComponentHandler.setup(Component, {props});
    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();

    act(() => selectAnswer({component, index: 3}));
    expect(component.tree).toMatchSnapshot();

    act(() => component.findByText("First Button").props.onClick());
    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();

    act(() => selectAnswer({component, index: 3}));
    expect(component.tree).toMatchSnapshot();

    act(() => component.findByText("Second Button").props.onClick());
    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).toHaveBeenCalled();
  });

  it("renders question 1", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 1 explanation", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => selectAnswer({component, index: 3}));

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 2", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => selectAnswer({component, index: 2}));
    act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 2 explanation", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => selectAnswer({component, index: 2}));
    act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
    act(() => selectAnswer({component, index: 2}));

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 3", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => selectAnswer({component, index: 3}));
    act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
    act(() => selectAnswer({component, index: 3}));
    act(() => component.findByText("cognitive_practice_step_2_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 3 explanation", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => selectAnswer({component, index: 3}));
    act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
    act(() => selectAnswer({component, index: 3}));
    act(() => component.findByText("cognitive_practice_step_2_button").props.onClick());
    act(() => selectAnswer({component, index: 3}));

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });
});
