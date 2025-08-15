import Component from "components/results/financial-risk/archetype/details";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import {useOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/data/assessment/personality/financial-risk";

describe("Results.FinancialRisk.Archetype.Details", () => {
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

  it("renders nothing if no archetype", async() => {
    mockAssessment({...assessment, archetype: null, personality_types: null});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
