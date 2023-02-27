import {Component} from "components/paradox/results/guide/index";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";
import benchmark from "support/json/benchmark.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.Guide", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["followBenchmark", "followGuide", "getOption", "isReady", "setElement", "translate", "ui"]),
      assessment,
      benchmark,
      guide: {
        assessment_id: "xyz",
        locale_key: "es-US",
        ...guide
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "Guide.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />);
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "Guide.updated",
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

    it("sets the guide data if the benchmark changes", () => {
      component = new ComponentHandler(<Component {...props} />);
      component.updateProps({
        benchmark: {
          ...benchmark,
          id: "updated-benchmark",
          dimensionRanges: [
            ...benchmark.dimensionRanges,
            {id: "1212ddd", dimensionId: "dcf233", matchScore: 5, maxScore: 10, minScore: 0}
          ]
        }
      });

      expect(component.tree).toMatchSnapshot();
    });

    it("sets the guide data if the guide's assessment ID changes", () => {
      component = new ComponentHandler(<Component {...props} />);
      component.updateProps({
        guide: {
          ...component.props.guide,
          assessment_id: "abc",
          competencies: updatedCompetencies
        }
      });

      expect(component.tree).toMatchSnapshot();
    });

    it("sets the guide data if the guide's locale changes", () => {
      component = new ComponentHandler(<Component {...props} />);
      component.updateProps({
        guide: {
          ...component.props.guide,
          competencies: updatedCompetencies,
          locale_key: "es-US"
        }
      });

      expect(component.tree).toMatchSnapshot();
    });

    it("sets the guide data if the guide's removed", () => {
      component = new ComponentHandler(<Component {...props} />);
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

  it("toggles expanded intro", () => {
    component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("show_more").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("toggles question content", () => {
    component = new ComponentHandler(<Component {...props} />);

    const question = props.guide.competencies[0].questionSequences[0].questions[1];
    const button = component.findByText(question.text, {exact: false})
      .parent.findByType("button");
    component.act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeCompetency", () => {
    component = new ComponentHandler(<Component {...props} />);
    const text = props.guide.competencies[1].name;
    const button = component.instance
      .find((element) => element.children[0] === text && element.type === "span")
      .parent;
    component.act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeCompetency through select", () => {
    component = new ComponentHandler(<Component {...props} />);
    const value = props.guide.competencies[1].id;
    component.act(() => component.instance.findByType("select").props.onChange({target: {value}}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component if benchmark not ready", () => {
    props.benchmark = null;
    props.isReady.mockImplementation((value) => value !== "benchmark");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with combined prop", () => {
    props.combined = true;
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["InterviewGuide"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if guide not ready", () => {
    props.guide = null;
    props.isReady.mockImplementation((value) => value !== "guide");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no competencies", () => {
    props.guide.competencies = [];
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
