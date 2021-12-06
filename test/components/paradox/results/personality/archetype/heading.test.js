import {Component} from "components/paradox/results/personality/archetype/heading";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";
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
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = {
      assessment: {...assessment, archetype: {...assessment.archetype, details: [...details]}},
      deck,
      followDeck: jest.fn().mockName("followDeck"),
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      setElement: jest.fn().mockName("setElement"),
      translate: jest.fn().mockName("translate").mockImplementation((value, _options = {}) => `${value}, ${_options}`),
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

  describe("fallbacks", () => {
    it("renders component in third person", () => {
      mockOptions(props.getOption, {...options, perspective: "thirdPerson"});
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without badge", () => {
      props.assessment.archetype.details = details.filter(({title}) => !title.includes("Badge"));
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without Paradox data", () => {
      props.assessment.archetype.details = [...oldDetails];
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without video", () => {
      props.assessment.archetype.details = details.filter(({title}) => !title.includes("Video"));
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
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

  it("renders component with headers", () => {
    mockOptions(props.getOption, {...options, allowHeaders: true});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {...options, disabledComponents: ["PersonalityArchetype"]});
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
