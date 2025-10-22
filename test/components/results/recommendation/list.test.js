import {act} from "react-test-renderer";
import Dropdown from "components/common/dropdown";
import Component from "components/results/recommendation/list";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockRecommendation, useAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import assessment from "support/data/assessment/personality/completed";
import orderRecommendation from "support/data/recommendation/personality/completed";
import useContainer from "support/hooks/use-container";

jest.mock("components/common/dropdown", () => (() => <div className="mock">Dropdown</div>));

describe("Results.RecommendationList", () => {
  let component;

  useContainer({assessmentID: assessment.id});
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
    mockRecommendation(null);
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
    mockRecommendation(orderRecommendation, {benchmarkID: "other-xyz", profileID: "profile-xyz"});
    component = await ComponentHandler.setup(Component);
    await act(async() => component.instance.findByType(Dropdown).props.onChange({target: {name: "Other", value: "other-xyz"}}));

    expect(component.tree).toMatchSnapshot();
  });
});
