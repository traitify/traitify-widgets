import Component from "components/results/financial-risk/archetype/score-bar";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import {useOption} from "support/container/options";
import _assessment from "support/data/assessment/personality/financial-risk";
import useContainer from "support/hooks/use-container";

describe("Results.FinancialRisk.Archetype.ScoreBar", () => {
  let assessment;
  let component;

  useContainer({assessmentID: _assessment.id});
  useAssessment(_assessment);
  useOption("perspective", "thirdPerson");

  describe("risk levels", () => {
    beforeEach(() => {
      assessment = mutable(_assessment);
    });

    it("renders aggressive", async() => {
      assessment.archetype.details = [{body: "aggressive", title: "risk_level"}];
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders conservative", async() => {
      assessment.archetype.details = [{body: "conservative", title: "risk_level"}];
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders measured", async() => {
      assessment.archetype.details = [{body: "measured", title: "risk_level"}];
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders neutral", async() => {
      assessment.archetype.details = [{body: "neutral", title: "risk_level"}];
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders receptive", async() => {
      assessment.archetype.details = [{body: "receptive", title: "risk_level"}];
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

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
