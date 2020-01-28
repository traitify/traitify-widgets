import {Component} from "components/results/candidate-results/personality-details";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/helpers", () => ({detailWithPerspective: jest.fn().mockImplementation((options) => options.base[options.name] || options.name)}));
jest.mock("lib/with-traitify", () => ((value) => value));

const cautions = [
  {body: "Be Cautious", title: "Caution Zone"},
  {body: "Of People", title: "Caution Zone"}
];
const settings = [
  {body: "Encourages peer support in pursuit of goals", title: "Settings that Work for You"},
  {body: "De-emphasizes competition among colleagues", title: "Settings that Work for You"},
  {body: "Often has a fast paced and energetic vibe", title: "Settings that Work for You"},
  {body: "Includes opportunities for large group discussions", title: "Settings that Work for You"},
  {body: "Values creativity", title: "Settings that Work for You"},
  {body: "Has opportunities for innovation and exploration", title: "Settings that Work for You"},
  {body: "Fueled by a sense of duty", title: "Settings that Work for You"},
  {body: "Prioritizes work quality", title: "Settings that Work for You"},
  {body: "Allows individuals to deal with their own setbacks", title: "Settings that Work for You"},
  {body: "Requires people to respond to challenges", title: "Settings that Work for You"}
];
const tools = [
  {body: "Compatible with many other personalities", title: "Tools to Use"},
  {body: "Sought after as a good person to dialogue with", title: "Tools to Use"},
  {body: "Work at a pace that suits everyone", title: "Tools to Use"},
  {body: "High energy, outgoing", title: "Tools to Use"},
  {body: "Comfortable in the limelight", title: "Tools to Use"},
  {body: "Have effective coping strategies for work stress", title: "Tools to Use"}
];

const assessmentWith = (details) => ({
  ...assessment, archetype: {...assessment.archetype, details}
});

describe("PersonalityDetails", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment: assessmentWith([...cautions, ...settings, ...tools]),
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDetails.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDetails.updated", component.instance);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with cautions", () => {
    props.getOption.mockImplementation((key) => (key === "perspective" ? "firstPerson" : []));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    props.getOption.mockReturnValue(["PersonalitySettings", "PersonalityTools"]);
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

  it("renders nothing if no details", () => {
    props.assessment = assessmentWith([]);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders settings if no tools", () => {
    props.assessment = assessmentWith([...settings]);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders settings if tools disabled", () => {
    props.getOption.mockReturnValueOnce(["PersonalityTools"]);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders tools if no settings", () => {
    props.assessment = assessmentWith([...tools]);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders tools if settings disabled", () => {
    props.getOption.mockReturnValueOnce(["PersonalitySettings"]);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
