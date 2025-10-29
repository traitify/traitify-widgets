import Component from "components/results/financial-risk/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import {useOption} from "support/container/options";
import assessment from "support/data/assessment/personality/financial-risk";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/financial-risk/dimension/details", () => ((props) => (
  <div className="mock">Personality Dimension - {props.type.personality_type.name}</div>
)));

describe("Results.FinancialRisk.Dimension.List", () => {
  let component;

  useContainer({assessmentID: assessment.id});
  useAssessment(assessment);
  useOption("perspective", "thirdPerson");

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
