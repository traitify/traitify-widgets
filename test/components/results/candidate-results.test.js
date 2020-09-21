import Component from "components/results/candidate-results";
import PersonalityDimensions from "components/results/personality/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";

jest.mock("components/results/guide", () => (() => (<div className="mock">Guide</div>)));
jest.mock("components/results/personality/archetype/heading", () => (() => (<div className="mock">Personality Archetype Heading</div>)));
jest.mock("components/results/personality/archetype/tips", () => (() => (<div className="mock">Personality Archetype Tips</div>)));
jest.mock("components/results/personality/dimension/list", () => (() => (<div className="mock">Personality Dimension List</div>)));
jest.mock("components/results/personality/trait/list", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("CandidateResults", () => {
  let props;

  beforeEach(() => {
    props = {
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

  it("renders results in firstPerson", () => {
    mockOptions(props.getOption, {perspective: "firstPerson"});
    const component = new ComponentHandler(<Component {...props} />);
    const dimensions = component.instance.findByType(PersonalityDimensions);

    expect(component.tree).toMatchSnapshot();
    expect(dimensions.props.disabledComponents).toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
  });

  it("renders results in thirdPerson", () => {
    mockOptions(props.getOption, {perspective: "thirdPerson"});
    props.followGuide = jest.fn().mockName("followGuide").mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);
    const dimensions = component.instance.findByType(PersonalityDimensions);

    expect(component.tree).toMatchSnapshot();
    expect(dimensions.props.disabledComponents).not.toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
  });
});
