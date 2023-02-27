import {Component} from "components/results/financial-risk-results";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";

jest.mock("components/results/financial-risk-results/personality-archetype", () => (() => (<div className="mock">Personality Archetype</div>)));
jest.mock("components/results/financial-risk-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/financial-risk-results/personality-dimensions", () => (() => (<div className="mock">Personality Dimensions</div>)));
jest.mock("components/results/financial-risk-results/personality-score-bar", () => (() => (<div className="mock">Personality Score Bar</div>)));
jest.mock("components/results/financial-risk-results/personality-takeaways", () => (() => (<div className="mock">Personality Takeaways</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("FinancialRiskResults", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = mockProps(["getOption"]);
  });

  it("renders results", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders results for third person", () => {
    mockOptions(props.getOption, {...options, perspective: "thirdPerson"});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
