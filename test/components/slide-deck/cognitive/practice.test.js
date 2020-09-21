import Component from "components/slide-deck/cognitive/practice";
import Slide from "components/slide-deck/cognitive/slide";
import ComponentHandler, {act} from "support/component-handler";
import {useResizeMock, useWindowMock} from "support/mocks";

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
