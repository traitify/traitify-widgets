import {Component} from "components/paradox/results/personality/archetype/heading";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";
import deck from "support/json/deck/big-five.json";

jest.mock("lib/with-traitify", () => ((value) => value));

const newDetails = [
  {body: "https://cdn.traitify.com/frtq/paradox/conservative_white.png", title: "Paradox - Badge"},
  {body: "https://cdn.traitify.com/content/archetype-videos/paradox/upholder.mp4", title: "Paradox - Video"},
  {body: "https://cdn.traitify.com/content/archetype-videos/paradox/upholder.vtt", title: "Paradox - Video - Text Track"},
  {body: "https://cdn.traitify.com/content/archetype-videos/paradox/upholder.jpg", title: "Paradox - Video - Thumbnail"}
];

const oldDetails = [
  ...assessment.archetype.details,
  {body: "Maybe just hire qualified candidates", title: "Hiring Manager Description"},
  {body: "https://cdn.traitify.com/frtq/conservative_white.png", title: "Badge"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.mp4", title: "Video"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.vtt", title: "Video - Text Track"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.jpg", title: "Video - Thumbnail"}
];

const details = [...oldDetails, ...newDetails];

describe("Paradox.PersonalityArchetypeHeading", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = {
      ...mockProps(["followDeck", "getOption", "isReady", "setElement", "translate", "ui"]),
      assessment: {...assessment, archetype: {...assessment.archetype, details: [...details]}},
      deck
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityArchetype.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />);
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityArchetype.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  describe("fallbacks", () => {
    it("renders component in third person", () => {
      mockOptions(props.getOption, {...options, perspective: "thirdPerson"});
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without badge", () => {
      props.assessment.archetype.details = details.filter(({title}) => !title.includes("Badge"));
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without Paradox data", () => {
      props.assessment.archetype.details = [...oldDetails];
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without video", () => {
      props.assessment.archetype.details = details.filter(({title}) => !title.includes("Video"));
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("follows the deck", () => {
    new ComponentHandler(<Component {...props} />);

    expect(props.followDeck).toHaveBeenCalled();
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {...options, allowHeaders: true});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {...options, disabledComponents: ["PersonalityArchetype"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if deck not ready", () => {
    props.deck = null;
    props.isReady.mockImplementation((value) => value !== "deck");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", () => {
    props.assessment = {...props.assessment, archetype: null};
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
