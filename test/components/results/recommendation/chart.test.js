import Component from "components/results/recommendation/chart";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {
  mockAssessment,
  mockBenchmark,
  mockGuide,
  mockSettings,
  useAssessment,
  useBenchmark,
  useSettings
} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/data/assessment/personality/completed";
import {data as benchmark} from "support/data/benchmark";
import _guide from "support/data/guide.json";

describe("Results.RecommendationChart", () => {
  let component;
  let guide;

  useContainer({assessmentID: assessment.id});
  useAssessment(assessment);
  useBenchmark(benchmark);
  useSettings({});

  beforeEach(() => {
    guide = mutable({..._guide, assessmentId: assessment.id});

    mockGuide(guide);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "RecommendationChart.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "RecommendationChart.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component if benchmark not ready", async() => {
    mockBenchmark(null, {id: benchmark.benchmarkId});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with combined prop", async() => {
    component = await ComponentHandler.setup(Component, {props: {combined: true}});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["RecommendationChart"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if guide not ready", async() => {
    mockGuide(null, {assessmentID: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not allowed", async() => {
    mockSettings({show_fit_breakdown_graph: false});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no competencies", async() => {
    guide.personality.competencies = [];
    mockGuide(guide);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
