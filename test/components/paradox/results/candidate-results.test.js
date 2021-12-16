import Component from "components/paradox/results/candidate-results";
import PersonalityDimensions from "components/results/personality/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockProps} from "support/helpers";

jest.mock("components/results/personality/archetype/heading", () => (() => (<div className="mock">Personality Archetype Heading</div>)));
jest.mock("components/results/personality/archetype/tips", () => (() => (<div className="mock">Personality Archetype Tips</div>)));
jest.mock("components/results/personality/dimension/list", () => (() => (<div className="mock">Personality Dimension List</div>)));
jest.mock("components/results/personality/trait/list", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.CandidateResults", () => {
  let component;
  let props;

  beforeEach(() => {
    props = mockProps(["getOption", "setElement"]);
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);
    const dimensions = component.instance.findByType(PersonalityDimensions);

    expect(component.tree).toMatchSnapshot();
    expect(dimensions.props.disabledComponents).toEqual(expect.arrayContaining(["PersonalityPitfalls"]));
  });
});
