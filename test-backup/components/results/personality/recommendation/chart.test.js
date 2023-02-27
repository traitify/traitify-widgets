/** @jest-environment jsdom */
import {Component} from "components/results/personality/recommendation/chart";
import Chart from "lib/helpers/stacked-chart";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import benchmarkFixture from "support/json/benchmark.json";
import guide from "support/json/guide.json";

jest.mock("lib/helpers/stacked-chart");
jest.mock("lib/with-traitify", () => ((value) => value));

const updatedGuide = {
  ...guide,
  competencies: guide.competencies.map(({questionSequences, ...competency}) => ({
    ...competency,
    questionSequences: questionSequences
      .map(({personality_type_id: id, ...sequence}) => ({...sequence, personalityTypeId: id}))
  }))
};

describe("PersonalityRecommendationChart", () => {
  const getContext = jest.fn().mockName("getContext");
  const createNodeMock = () => ({getContext});
  let props;

  beforeEach(() => {
    Chart.mockClear();
    getContext.mockClear();

    props = {
      assessment,
      benchmark: benchmarkFixture,
      followBenchmark: jest.fn().mockName("followBenchmark"),
      followGuide: jest.fn().mockName("followGuide"),
      guide,
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityRecommendationChart.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityRecommendationChart.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("renders component if guide not ready", () => {
    props.guide = null;
    props.isReady.mockImplementation((value) => value !== "guide");
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("renders component with updated guide", () => {
    props.guide = updatedGuide;
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("renders nothing if benchmark no longer ready", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
    component.updateProps({
      benchmark: null,
      isReady: jest.fn().mockName("isReady").mockImplementation((value) => value !== "benchmark")
    });

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("renders nothing if benchmark not ready", () => {
    props.benchmark = null;
    props.isReady.mockImplementation((value) => value !== "benchmark");
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(0);
  });

  it("renders nothing if results no longer ready", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
    component.updateProps({
      assessment: null,
      isReady: jest.fn().mockName("isReady").mockImplementation((value) => value !== "results")
    });

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(0);
  });

  it("creates chart when ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(Chart.mock.instances).toHaveLength(0);

    component.updateProps({
      assessment,
      isReady: jest.fn().mockName("isReady").mockReturnValue(true)
    });

    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("creates new chart on assessment change", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
    component.updateProps({
      assessment: {
        ...assessment,
        personality_types: [
          {
            ...assessment.personality_types[0],
            personality_type: {...assessment.personality_types[0].personality_type, name: "New Type"}
          },
          ...assessment.personality_types.slice(1)
        ]
      }
    });

    expect(Chart.mock.instances).toHaveLength(2);
  });

  it("creates new chart on benchmark change", () => {
    const benchmark = benchmarkFixture;
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
    component.updateProps({benchmark: {...benchmark, dimensionId: "benchmark-2", id: "benchmark-2"}});

    expect(Chart.mock.instances).toHaveLength(2);

    component.updateProps({
      benchmark: {
        ...benchmark,
        resultRankings: [
          {...benchmark.resultRankings[0], description: "New Description"},
          ...benchmark.resultRankings.slice(1)
        ]
      }
    });

    expect(Chart.mock.instances).toHaveLength(3);
  });

  it("creates new chart on guide change", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    component.updateProps({
      guide: {
        ...guide,
        competencies: [
          {...guide.competencies[0], name: "New Name"},
          ...guide.competencies.slice(1)
        ]
      }
    });

    expect(Chart.mock.instances).toHaveLength(2);
  });

  describe("resize", () => {
    let addEventListenerSpy;
    let removeEventListenerSpy;

    beforeAll(() => {
      addEventListenerSpy = jest.spyOn(window, "addEventListener");
      removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    });

    afterEach(() => {
      addEventListenerSpy.mockClear();
      removeEventListenerSpy.mockClear();
    });

    afterAll(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it("adds event listener", () => {
      new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(removeEventListenerSpy).not.toHaveBeenCalledWith("resize", expect.any(Function));
    });

    it("calls event listener callback", () => {
      const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      const resize = addEventListenerSpy.mock.calls.find((call) => call[0] === "resize")[1];

      resize();

      expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(removeEventListenerSpy).not.toHaveBeenCalledWith("resize", expect.any(Function));
      expect(Chart.mock.instances).toHaveLength(1);
      expect(component.tree).toMatchSnapshot();
    });

    it("removes event listener", () => {
      const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      component.unmount();

      expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    });
  });
});
