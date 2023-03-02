import Component from "components/personality/dimension/chart";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockGuide, useAssessment, useGuide} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

describe("PersonalityDimensionChart", () => {
  let component;

  useContainer();
  useAssessment(assessment);
  useGuide(guide, {assessmentID: assessment.id});

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionChart.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      component.updateProps();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionChart.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without guide", async() => {
    mockGuide(null, {assessmentID: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
