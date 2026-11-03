import Component from "components/results/cognitive/chart";
import ComponentHandler from "support/component-handler";
import {
  mockCognitiveAssessment,
  useCognitiveAssessment
} from "support/container/http";
import {mockOption, useOptions} from "support/container/options";
import assessment from "support/data/assessment/cognitive/completed";
import useContainer from "support/hooks/use-container";

describe("Results.CognitiveChart", () => {
  let component;

  useContainer({assessmentID: assessment.id});
  useCognitiveAssessment(assessment);
  useOptions({surveyType: "cognitive"});

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "CognitiveChart.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "CognitiveChart.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["CognitiveChart"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockCognitiveAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
