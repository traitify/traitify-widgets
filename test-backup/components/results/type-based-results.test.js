import Component from "components/results/type-based-results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/type-based-results/personality-base", () => (() => (<div className="mock">Personality Base</div>)));
jest.mock("components/results/type-based-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/type-based-results/personality-traits", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("components/results/type-based-results/personality-types", () => (() => (<div className="mock">Personality Types</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("TypeBasedResults", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption").mockReturnValue(false),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`)
    };
  });

  it("renders results", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders results with headers", () => {
    props.getOption = props.getOption.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
