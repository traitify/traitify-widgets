import Component from "components/results/financial-risk";
import ComponentHandler from "support/component-handler";
import {useAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/financial-risk.json";

jest.mock("components/results/financial-risk/archetype/details", () => (() => <div className="mock">Archetype Details</div>));
jest.mock("components/results/financial-risk/archetype/heading", () => (() => <div className="mock">Archetype Heading</div>));
jest.mock("components/results/financial-risk/archetype/score-bar", () => (() => <div className="mock">Archetype Scorebar</div>));
jest.mock("components/results/financial-risk/archetype/takeaways", () => (() => <div className="mock">Archetype Takeaways</div>));
jest.mock("components/results/financial-risk/dimension/list", () => (() => <div className="mock">Dimension List</div>));

describe("Results.FinancialRisk", () => {
  let component;

  useContainer();
  useAssessment(assessment);

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders results for third person", async() => {
    mockOption("perspective", "thirdPerson");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
