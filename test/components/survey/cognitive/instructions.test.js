/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/cognitive/instructions";
import Practice from "components/survey/cognitive/practice";
import ComponentHandler from "support/component-handler";
import {mockSettings, useSettings} from "support/container/http";
import useContainer from "support/hooks/use-container";
import useResizeMock from "support/hooks/use-resize-mock";

jest.mock("components/survey/cognitive/practice", () => (() => <div className="mock">Practice</div>));

describe("Instructions", () => {
  let component;
  let props;

  useContainer();
  useSettings({});

  beforeEach(() => {
    props = {
      onStart: jest.fn().mockName("onStart"),
      surveyID: "xyz",
      translate: jest.fn().mockName("translate").mockImplementation((value) => value)
    };
  });

  describe("skip assessment accommodation", () => {
    beforeEach(() => {
      mockSettings({skip_assessment_accommodation: true});
    });

    it("renders instructions", async() => {
      component = await ComponentHandler.setup(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });

    it("renders accommodation text", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("survey.accommodation.request").props.onClick());

      expect(component.tree).toMatchSnapshot();
    });

    it("renders back action", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("survey.accommodation.request").props.onClick());
      act(() => component.findByText("back").props.onClick());

      expect(component.tree).toMatchSnapshot();
    });

    it("triggers accommodation request", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("survey.accommodation.request").props.onClick());
      act(() => component.findByText("survey.accommodation.confirm").props.onClick());

      expect(component.tree).toMatchSnapshot();
    });

    it("triggers next", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("start", () => {
    it("calls onStart", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
      act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
      act(() => component.instance.findByType(Practice).props.onFinish());
      act(() => component.findByText("cognitive_instructions_step_4_button").props.onClick());

      expect(props.onStart).toHaveBeenCalledWith({disability: false});
    });

    it("passes disability", async() => {
      props.captureLearningDisability = true;
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
      act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
      act(() => component.instance.findByType(Practice).props.onFinish());
      act(() => component.instance.findByType("input").props.onChange());
      act(() => component.findByText("cognitive_instructions_step_4_button").props.onClick());

      expect(props.onStart).toHaveBeenCalledWith({disability: true});
    });

    it("passes initial disability", async() => {
      props.initialLearningDisability = true;
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
      act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
      act(() => component.instance.findByType(Practice).props.onFinish());
      act(() => component.findByText("cognitive_instructions_step_4_button").props.onClick());

      expect(props.onStart).toHaveBeenCalledWith({disability: true});
    });
  });

  describe("videos", () => {
    useResizeMock();

    describe("horizontal", () => {
      beforeEach(async() => {
        act(() => window.resizeTo(1200, 800));
        component = await ComponentHandler.setup(Component, {props});
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

        it("renders step 1", async() => {
          component = await ComponentHandler.setup(Component, {props});

          expect(component.tree).toMatchSnapshot();
        });

        it("renders step 4", async() => {
          component = await ComponentHandler.setup(Component, {props});
          act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
          act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
          act(() => component.instance.findByType(Practice).props.onFinish());

          expect(component.tree).toMatchSnapshot();
        });
      });

      describe("untimed", () => {
        beforeEach(() => {
          props.options.timeTrial.timed = false;
        });

        it("renders step 1", async() => {
          component = await ComponentHandler.setup(Component, {props});

          expect(component.tree).toMatchSnapshot();
        });

        it("renders step 4", async() => {
          component = await ComponentHandler.setup(Component, {props});
          act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
          act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
          act(() => component.instance.findByType(Practice).props.onFinish());

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

        it("renders step 4", async() => {
          component = await ComponentHandler.setup(Component, {props});

          expect(component.tree).toMatchSnapshot();
        });
      });

      describe("untimed", () => {
        beforeEach(() => {
          props.options.timeTrial.timed = false;
        });

        it("renders step 4", async() => {
          component = await ComponentHandler.setup(Component, {props});

          expect(component.tree).toMatchSnapshot();
        });
      });
    });
  });

  it("renders custom examples", async() => {
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

    component = await ComponentHandler.setup(Component, {props});
    expect(component.tree).toMatchSnapshot();

    act(() => component.findByText("First Button").props.onClick());
    expect(component.tree).toMatchSnapshot();

    act(() => component.findByText("Second Button").props.onClick());
    expect(component.tree).toMatchSnapshot();

    act(() => component.findByText("Third Button").props.onClick());
    expect(component.tree).toMatchSnapshot();

    act(() => component.instance.findByType(Practice).props.onFinish());
    expect(component.tree).toMatchSnapshot();
  });

  it("renders custom instructions", async() => {
    props.options = {
      finalInstruction: {
        button: "Goodbye",
        heading: "Custom Instructions",
        text: "<ul><li>Some Text</li><li>More Text</li></ul>",
        video: "https://cdn.traitify.com/images/cognitive/practice-example-h.mp4"
      }
    };

    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
    act(() => component.instance.findByType(Practice).props.onFinish());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders custom instructions with markdown", async() => {
    props.options = {
      finalInstruction: {
        button: "Goodbye",
        heading: "Custom Instructions",
        text: "- Some Text\n- More Text",
        video: "https://cdn.traitify.com/images/cognitive/practice-example-h.mp4"
      }
    };

    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
    act(() => component.instance.findByType(Practice).props.onFinish());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 1", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 2", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 3", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders step 4", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText("cognitive_instructions_step_1_button").props.onClick());
    act(() => component.findByText("cognitive_instructions_step_2_button").props.onClick());
    act(() => component.instance.findByType(Practice).props.onFinish());

    expect(component.tree).toMatchSnapshot();
  });
});
