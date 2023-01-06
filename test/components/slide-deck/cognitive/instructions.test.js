/** @jest-environment jsdom */
import Component from "components/slide-deck/cognitive/instructions";
import Practice from "components/slide-deck/cognitive/practice";
import ComponentHandler, {act} from "support/component-handler";
import useResizeMock from "support/hooks/use-resize-mock";

jest.mock("components/slide-deck/cognitive/practice", () => (() => <div className="mock">Practice</div>));

describe("Instructions", () => {
  let props;

  beforeEach(() => {
    props = {
      onStart: jest.fn().mockName("onStart"),
      translate: jest.fn().mockName("translate").mockImplementation((value) => value)
    };
  });

  describe("start", () => {
    it("calls onStart", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
      component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
      component.act(() => component.instance.findByType(Practice).props.onFinish());
      component.act(() => component.findByText("cognitive_instructions_step_4_button").props.onClick());

      expect(props.onStart).toHaveBeenCalledWith({disability: false});
    });

    it("passes disability", () => {
      props.captureLearningDisability = true;
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
      component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
      component.act(() => component.instance.findByType(Practice).props.onFinish());
      component.act(() => component.instance.findByType("input").props.onChange());
      component.act(() => component.findByText("cognitive_instructions_step_4_button").props.onClick());

      expect(props.onStart).toHaveBeenCalledWith({disability: true});
    });

    it("passes initial disability", () => {
      props.initialLearningDisability = true;
      const component = new ComponentHandler(<Component {...props} />);
      component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
      component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
      component.act(() => component.instance.findByType(Practice).props.onFinish());
      component.act(() => component.findByText("cognitive_instructions_step_4_button").props.onClick());

      expect(props.onStart).toHaveBeenCalledWith({disability: true});
    });
  });

  describe("videos", () => {
    let component;

    useResizeMock();

    describe("horizontal", () => {
      beforeEach(() => {
        act(() => window.resizeTo(1200, 800));
        component = new ComponentHandler(<Component {...props} />);
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

  describe("time trial", () => {
    beforeEach(() => {
      props.options = {};
      props.options.timeTrial = {};
    });

    describe("default", () => {
      beforeEach(() => {
        props.options.timeTrial.minimal = false;
      });

      describe("timed", () => {
        beforeEach(() => {
          props.options.timeTrial.timed = true;
        });

        it("renders step 1", () => {
          const component = new ComponentHandler(<Component {...props} />);

          expect(component.tree).toMatchSnapshot();
        });

        it("renders step 4", () => {
          const component = new ComponentHandler(<Component {...props} />);
          component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
          component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
          component.act(() => component.instance.findByType(Practice).props.onFinish());

          expect(component.tree).toMatchSnapshot();
        });
      });

      describe("untimed", () => {
        beforeEach(() => {
          props.options.timeTrial.timed = false;
        });

        it("renders step 1", () => {
          const component = new ComponentHandler(<Component {...props} />);

          expect(component.tree).toMatchSnapshot();
        });

        it("renders step 4", () => {
          const component = new ComponentHandler(<Component {...props} />);
          component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
          component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
          component.act(() => component.instance.findByType(Practice).props.onFinish());

          expect(component.tree).toMatchSnapshot();
        });
      });
    });

    describe("minimal", () => {
      beforeEach(() => {
        props.options.timeTrial.minimal = true;
      });

      describe("timed", () => {
        beforeEach(() => {
          props.options.timeTrial.timed = true;
        });

        it("renders step 4", () => {
          const component = new ComponentHandler(<Component {...props} />);

          expect(component.tree).toMatchSnapshot();
        });
      });

      describe("untimed", () => {
        beforeEach(() => {
          props.options.timeTrial.timed = false;
        });

        it("renders step 4", () => {
          const component = new ComponentHandler(<Component {...props} />);

          expect(component.tree).toMatchSnapshot();
        });
      });
    });
  });

  it("renders custom examples", () => {
    props.options = {
      practiceExamples: [
        {button: "First Button", heading: "First Heading", text: "First Text"},
        {button: "Second Button", heading: "Second Heading", text: "Second Text"},
        {
          button: "Third Button",
          heading: "Third Heading",
          text: "Third Text",
          video: "https://cdn.traitify.com/images/cognitive/practice-example-h.mp4"
        }
      ]
    };

    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();

    component.act(() => component.findByText("First Button").props.onClick());
    expect(component.tree).toMatchSnapshot();

    component.act(() => component.findByText("Second Button").props.onClick());
    expect(component.tree).toMatchSnapshot();

    component.act(() => component.findByText("Third Button").props.onClick());
    expect(component.tree).toMatchSnapshot();

    component.act(() => component.instance.findByType(Practice).props.onFinish());
    expect(component.tree).toMatchSnapshot();
  });

  it("renders custom instructions", () => {
    props.options = {
      finalInstruction: {
        button: "Goodbye",
        heading: "Custom Instructions",
        text: "<ul><li>Some Text</li><li>More Text</li></ul>",
        video: "https://cdn.traitify.com/images/cognitive/practice-example-h.mp4"
      }
    };

    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
    component.act(() => component.instance.findByType(Practice).props.onFinish());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders custom instructions with markdown", () => {
    props.options = {
      finalInstruction: {
        button: "Goodbye",
        heading: "Custom Instructions",
        text: "- Some Text\n- More Text",
        video: "https://cdn.traitify.com/images/cognitive/practice-example-h.mp4"
      }
    };

    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
    component.act(() => component.instance.findByType(Practice).props.onFinish());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 1", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 2", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 3", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 4", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    component.act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
    component.act(() => component.instance.findByType(Practice).props.onFinish());

    expect(component.tree).toMatchSnapshot();
  });
});
