import {act} from "react-test-renderer";
import Component from "components/results/recommendation/list";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";

describe("Results.RecommendationList", () => {
  let component;

  useContainer();
  useAssessment(assessment);

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "RecommendationList.initialized",
        {
          benchmarkID: undefined,
          benchmarkTag: null,
          recommendation: null,
          recommendations: null
        }
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      const recommendation = expect.objectContaining({recommendation_id: "benchmark-xyz"});

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "RecommendationList.updated",
        {
          benchmarkID: "benchmark-xyz",
          benchmarkTag: null,
          recommendation,
          recommendations: expect.arrayContaining([recommendation])
        }
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with tag", async() => {
    mockAssessment({
      ...assessment,
      recommendation: {...assessment.recommendation, benchmark_tag: "allow"},
      recommendations: [
        {...assessment.recommendation, benchmark_tag: "allow"},
        {...assessment.recommendation, benchmark_tag: "deny", recommendation_id: "other-xyz"}
      ]
    });
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without score", async() => {
    mockOption("disabledComponents", ["RecommendationScore"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["RecommendationList"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("updates recommendation", async() => {
    mockAssessment({
      ...assessment,
      recommendations: [
        {...assessment.recommendation},
        {...assessment.recommendation, benchmark_name: "Other", recommendation_id: "other-xyz"}
      ]
    });
    component = await ComponentHandler.setup(Component);
    act(() => component.instance.findByType("select").props.onChange({target: {value: "other-xyz"}}));

    expect(component.tree).toMatchSnapshot();
  });
});
