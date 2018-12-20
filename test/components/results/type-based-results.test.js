import Component from "components/results/type-based-results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/type-based-results/personality-base", () => (() => (<div className="mock">Personality Base</div>)));
jest.mock("components/results/type-based-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/type-based-results/personality-traits", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("components/results/type-based-results/personality-types", () => (() => (<div className="mock">Personality Types</div>)));
jest.mock("lib/with-traitify");

describe("TypeBasedResults", () => {
  it("renders results", () => {
    const component = new ComponentHandler(<Component />);

    expect(component.tree).toMatchSnapshot();
  });
});
