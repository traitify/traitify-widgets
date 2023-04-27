import {act} from "react-test-renderer";
import Component from "components/results/guide/personality";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockBenchmark, mockGuide, useAssessment, useBenchmark} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import benchmark from "support/json/benchmark.json";
import _guide from "support/json/guide.json";

describe("Results.Guide.Personality", () => {
  let component;
  let guide;

  useContainer();
  useAssessment(assessment);
  useBenchmark(benchmark);

  beforeEach(() => {
    guide = mutable({..._guide, assessmentId: assessment.id});

    mockGuide(guide);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityGuide.initialized",
        {activeCompetency: null}
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityGuide.updated",
        {activeCompetency: null}
      );
    });
  });

  it("toggles expanded intro", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => component.findByText("Show More").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("toggles question content", async() => {
    component = await ComponentHandler.setup(Component);
    const question = guide.personality.competencies[0].questionSequences[0].questions[1];
    const button = component.findByText(question.text, {exact: false})
      .parent.findByType("button");
    act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeCompetency", async() => {
    component = await ComponentHandler.setup(Component);
    const text = guide.personality.competencies[1].name;
    const button = component.instance
      .find((element) => element.children[0] === text && element.type === "span")
      .parent;
    act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeCompetency through select", async() => {
    component = await ComponentHandler.setup(Component);
    const value = guide.personality.competencies[1].id;
    act(() => component.instance.findByType("select").props.onChange({target: {value}}));

    expect(component.tree).toMatchSnapshot();
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
    mockOption("disabledComponents", ["Guide"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if guide not ready", async() => {
    mockGuide(null, {assessmentID: assessment.id});
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
