import Component from "components/results/cognitive/chart";
import ComponentHandler from "support/component-handler";
import {
  mockCognitiveAssessment,
  mockSettings,
  useCognitiveAssessment,
  useSettings
} from "support/container/http";
import {mockOption, useOptions} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/cognitive-results.json";

describe("Results.CognitiveChart", () => {
  let component;

  useContainer();
  useCognitiveAssessment(assessment);
  useOptions({surveyType: "cognitive"});
  useSettings({show_cognitive_results: true});

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

  it("renders nothing if not allowed", async() => {
    mockSettings({show_cognitive_results: false});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockCognitiveAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
