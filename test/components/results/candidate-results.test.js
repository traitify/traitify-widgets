import Component from "components/results/candidate-results";
import PersonalityDimensions from "components/results/personality/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";

jest.mock("components/results/guide", () => (() => (<div className="mock">Guide</div>)));
jest.mock("components/results/personality/archetype/heading", () => (() => (<div className="mock">Personality Archetype Heading</div>)));
jest.mock("components/results/personality/archetype/tips", () => (() => (<div className="mock">Personality Archetype Tips</div>)));
jest.mock("components/results/personality/dimension/list", () => (() => (<div className="mock">Personality Dimension List</div>)));
jest.mock("components/results/personality/recommendation/chart", () => (() => (<div className="mock">Personality Recommendation Chart</div>)));
jest.mock("components/results/personality/trait/list", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("CandidateResults", () => {
  let component;
  let options;
  let props;
  const getDimensionComponent = () => component.instance.findByType(PersonalityDimensions);

  beforeEach(() => {
    options = {perspective: "firstPerson"};
    props = mockProps(["getOption", "followBenchmark", "followGuide", "isReady", "translate", "ui"]);

    mockOptions(props.getOption, options);
  });

  describe("allowHeaders", () => {
    beforeEach(() => {
      options = {...options, allowHeaders: true};

      mockOptions(props.getOption, options);
    });

    it("renders component", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
      expect(getDimensionComponent().props.disabledComponents).toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
    });

    it("renders component in thirdPerson", () => {
      mockOptions(props.getOption, {...options, perspective: "thirdPerson"});
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(getDimensionComponent().props.disabledComponents).toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
  });

  it("renders component in thirdPerson", () => {
    mockOptions(props.getOption, {...options, perspective: "thirdPerson"});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
