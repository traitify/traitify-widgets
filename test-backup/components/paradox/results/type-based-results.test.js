import Component from "components/paradox/results/type-based-results";
import ComponentHandler from "support/component-handler";
import {mockProps} from "support/helpers";

jest.mock("components/results/type-based-results/personality-base", () => (() => (<div className="mock">Personality Base</div>)));
jest.mock("components/results/type-based-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/type-based-results/personality-traits", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("components/results/type-based-results/personality-types", () => (() => (<div className="mock">Personality Types</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.TypeBasedResults", () => {
  let component;
  let props;

  beforeEach(() => {
    props = mockProps(["setElement"]);
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
