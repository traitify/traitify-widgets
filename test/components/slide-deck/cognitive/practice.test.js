import Component from "components/slide-deck/cognitive/practice";
import Slide from "components/slide-deck/cognitive/slide";
import {defaultExplanations, defaultQuestions} from "components/slide-deck/cognitive/instructions-defaults";
import ComponentHandler, {act} from "support/component-handler";
import useResizeMock from "support/hooks/use-resize-mock";
import useWindowMock from "support/hooks/use-window-mock";

jest.mock("components/slide-deck/cognitive/slide", () => (() => <div className="mock">Slide</div>));

const selectAnswer = ({component, index}) => {
  const {onSelect, question} = component.instance.findByType(Slide).props;

  onSelect({answerId: question.responses[index].id, timeTaken: 200});
};

describe("Practice", () => {
  let props;

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

    it("finishes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => selectAnswer({component, index: 3}));
      component.act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
      component.act(() => selectAnswer({component, index: 3}));
      component.act(() => component.findByText("cognitive_practice_step_2_button").props.onClick());
      component.act(() => selectAnswer({component, index: 3}));
      component.act(() => component.findByText("cognitive_practice_step_3_button").props.onClick());

      expect(component.tree).toMatchSnapshot();
      expect(props.onFinish).toHaveBeenCalled();
    });

    it("doesn't skip", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.findByType(Slide).props.onSkip();

      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe("videos", () => {
    let component;

    useResizeMock();

    describe("horizontal", () => {
      beforeEach(() => {
        act(() => window.resizeTo(1200, 800));
        component = new ComponentHandler(<Component {...props} />);
        component.act(() => selectAnswer({component, index: 0}));
      });

      it("renders component", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("updates to vertical", () => {
        component.act(() => window.resizeTo(600, 800));

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("vertical", () => {
      beforeEach(() => {
        act(() => window.resizeTo(600, 800));
        component = new ComponentHandler(<Component {...props} />);
        component.act(() => selectAnswer({component, index: 0}));
      });

      it("renders component", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("updates to horizontal", () => {
        component.act(() => window.resizeTo(1200, 800));

        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  it("renders custom questions", () => {
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

    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();

    component.act(() => selectAnswer({component, index: 3}));
    expect(component.tree).toMatchSnapshot();

    component.act(() => component.findByText("First Button").props.onClick());
    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();

    component.act(() => selectAnswer({component, index: 3}));
    expect(component.tree).toMatchSnapshot();

    component.act(() => component.findByText("Second Button").props.onClick());
    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).toHaveBeenCalled();
  });

  it("renders question 1", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 1 explanation", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => selectAnswer({component, index: 3}));

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 2", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => selectAnswer({component, index: 2}));
    component.act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 2 explanation", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => selectAnswer({component, index: 2}));
    component.act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
    component.act(() => selectAnswer({component, index: 2}));

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 3", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => selectAnswer({component, index: 3}));
    component.act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
    component.act(() => selectAnswer({component, index: 3}));
    component.act(() => component.findByText("cognitive_practice_step_2_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });

  it("renders question 3 explanation", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => selectAnswer({component, index: 3}));
    component.act(() => component.findByText("cognitive_practice_step_1_button").props.onClick());
    component.act(() => selectAnswer({component, index: 3}));
    component.act(() => component.findByText("cognitive_practice_step_2_button").props.onClick());
    component.act(() => selectAnswer({component, index: 3}));

    expect(component.tree).toMatchSnapshot();
    expect(props.onFinish).not.toHaveBeenCalled();
  });
});
