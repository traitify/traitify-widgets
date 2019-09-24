import {Component} from "components/results/financial-risk-results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/financial-risk-results/personality-archetype", () => (() => (<div className="mock">Personality Archetype</div>)));
jest.mock("components/results/financial-risk-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/financial-risk-results/personality-dimensions", () => (() => (<div className="mock">Personality Dimensions</div>)));
jest.mock("components/results/financial-risk-results/personality-score-bar", () => (() => (<div className="mock">Personality Score Bar</div>)));
jest.mock("components/results/financial-risk-results/personality-takeaways", () => (() => (<div className="mock">Personality Takeaways</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("FinancialRiskResults", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption")
    };
  });

  it("renders results", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders results for third person", () => {
    props.getOption.mockReturnValue("thirdPerson");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
