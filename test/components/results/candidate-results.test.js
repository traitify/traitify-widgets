import Component from "components/results/candidate-results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/candidate-results/personality-archetype", () => (() => (<div className="mock">Personality Archetype</div>)));
jest.mock("components/results/candidate-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/candidate-results/personality-dimensions", () => (() => (<div className="mock">Personality Dimensions</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("CandidateResults", () => {
  it("renders results", () => {
    const component = new ComponentHandler(<Component />);

    expect(component.tree).toMatchSnapshot();
  });
});
