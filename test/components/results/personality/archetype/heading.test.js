import {Component} from "components/results/personality/archetype/heading";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import deck from "support/json/deck/big-five.json";

jest.mock("lib/with-traitify", () => ((value) => value));

const details = [
  ...assessment.archetype.details,
  {body: "https://cdn.traitify.com/frtq/conservative_white.png", title: "Badge"},
  {body: "Maybe just hire qualified candidates", title: "Hiring Manager Description"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.mp4", title: "Video"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.vtt", title: "Video - Text Track"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.jpg", title: "Video - Thumbnail"}
];

describe("PersonalityArchetypeHeading", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment: {...assessment, archetype: {...assessment.archetype, details}},
      deck,
      followDeck: jest.fn().mockName("followDeck"),
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      options: {},
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
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
      const component = new ComponentHandler(<Component {...props} />);
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

  it("follows the deck", () => {
    new ComponentHandler(<Component {...props} />);

    expect(props.followDeck).toHaveBeenCalled();
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component in third person", () => {
    props.getOption.mockImplementation((key) => (key === "perspective" ? "thirdPerson" : []));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without badge", () => {
    props.assessment = {
      ...assessment,
      archetype: {
        ...assessment.archetype,
        details: details.filter((detail) => detail.title !== "Badge")
      }
    };
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders explanation text as fallback for video", () => {
    props.assessment = {
      ...assessment,
      archetype: {
        ...assessment.archetype,
        details: details.filter(({title}) => !title.startsWith("Video"))
      }
    };

    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    props.getOption.mockReturnValue(["PersonalityArchetype"]);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if deck not ready", () => {
    props.deck = null;
    props.isReady.mockImplementation((value) => value !== "deck");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", () => {
    props.assessment = {...props.assessment, archetype: null};
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
