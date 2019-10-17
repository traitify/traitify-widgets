import {Component} from "components/results/candidate-results/personality-archetype";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import deck from "support/json/deck/big-five.json";

jest.mock("lib/with-traitify", () => ((value) => value));

const assessmentWithBadge = {
  ...assessment,
  archetype: {
    ...assessment.archetype,
    details: [
      ...assessment.archetype.details,
      {body: "https://cdn.traitify.com/frtq/conservative_white.png", title: "Badge"}
    ]
  }
};

describe("PersonalityArchetype", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      deck,
      followDeck: jest.fn().mockName("followDeck"),
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
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
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityArchetype.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityArchetype.updated", component.instance);
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

  it("renders component with badge", () => {
    props.assessment = assessmentWithBadge;
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
