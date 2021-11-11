import {Component} from "components/paradox/results/personality/recommendation/chart";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import benchmark from "support/json/benchmark.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityRecommendationChart", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      benchmark,
      followBenchmark: jest.fn().mockName("followBenchmark"),
      followGuide: jest.fn().mockName("followGuide"),
      guide: {
        assessment_id: "xyz",
        locale_key: "es-US",
        ...guide
      },
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityRecommendationChart.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
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

  describe("update", () => {
    let updatedCompetencies;

    beforeEach(() => {
      updatedCompetencies = [
        {...props.guide.competencies[0], name: "Updated Name"},
        ...props.guide.competencies.slice(1)
      ];
    });

    it("sets the data if the benchmark changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({
        benchmark: {
          ...benchmark,
          id: "updated-benchmark",
          range_types: benchmark.range_types.map((rangeType) => ({
            ...rangeType, ranges: [{match_score: 5, max_score: 10, min_score: 0}]
          }))
        }
      });

      expect(component.tree).toMatchSnapshot();
    });

    it("sets the data if the guide's assessment ID changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({
        guide: {
          ...component.props.guide,
          assessment_id: "abc",
          competencies: updatedCompetencies
        }
      });

      expect(component.tree).toMatchSnapshot();
    });

    it("sets the data if the guide's locale changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({
        guide: {
          ...component.props.guide,
          competencies: updatedCompetencies,
          locale_key: "es-US"
        }
      });

      expect(component.tree).toMatchSnapshot();
    });

    it("sets the data if the guide's removed", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({guide: null});

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("follows the benchmark", () => {
    new ComponentHandler(<Component {...props} />);

    expect(props.followBenchmark).toHaveBeenCalled();
  });

  it("follows the guide", () => {
    new ComponentHandler(<Component {...props} />);

    expect(props.followGuide).toHaveBeenCalled();
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component if benchmark not ready", () => {
    props.benchmark = null;
    props.isReady.mockImplementation((value) => value !== "benchmark");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with combined prop", () => {
    props.combined = true;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if guide not ready", () => {
    props.guide = null;
    props.isReady.mockImplementation((value) => value !== "guide");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no competencies", () => {
    props.guide.competencies = [];
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
