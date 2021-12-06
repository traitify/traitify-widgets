import Component from "components/paradox/results/candidate-results";
import PersonalityDimensions from "components/results/personality/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";

jest.mock("components/results/guide", () => (() => (<div className="mock">Guide</div>)));
jest.mock("components/results/personality/archetype/heading", () => (() => (<div className="mock">Personality Archetype Heading</div>)));
jest.mock("components/results/personality/archetype/tips", () => (() => (<div className="mock">Personality Archetype Tips</div>)));
jest.mock("components/results/personality/dimension/list", () => (() => (<div className="mock">Personality Dimension List</div>)));
jest.mock("components/results/personality/recommendation/chart", () => (() => (<div className="mock">Personality Recommendation Chart</div>)));
jest.mock("components/results/personality/trait/list", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.CandidateResults", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption"),
      followBenchmark: jest.fn().mockName("followBenchmark"),
      followGuide: jest.fn().mockName("followGuide"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      options: {},
      setElement: jest.fn().mockName("setElement"),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  describe("allowHeaders", () => {
    let options;

    beforeEach(() => {
      options = {allowHeaders: true};

      mockOptions(props.getOption, options);
    });

    it("renders component", () => {
      mockOptions(props.getOption, {...options, perspective: "firstPerson"});
      const component = new ComponentHandler(<Component {...props} />);
      const dimensions = component.instance.findByType(PersonalityDimensions);

      expect(component.tree).toMatchSnapshot();
      expect(dimensions.props.disabledComponents).toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
    });

    it("renders component in third person", () => {
      mockOptions(props.getOption, {...options, perspective: "thirdPerson"});
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", () => {
    mockOptions(props.getOption, {perspective: "firstPerson"});
    const component = new ComponentHandler(<Component {...props} />);
    const dimensions = component.instance.findByType(PersonalityDimensions);

    expect(component.tree).toMatchSnapshot();
    expect(dimensions.props.disabledComponents).toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
  });

  it("renders component in third person", () => {
    mockOptions(props.getOption, {perspective: "thirdPerson"});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
