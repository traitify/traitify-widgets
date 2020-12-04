import {Component} from "components/results/guide/index";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Guide", () => {
  let props;
  let updatedCompetencies;

  beforeEach(() => {
    props = {
      assessment,
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

    updatedCompetencies = [
      {...props.guide.competencies[0], name: "Updated Name"},
      ...props.guide.competencies.slice(1)
    ];
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "Guide.initialized",
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
        "Guide.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  describe("update", () => {
    it("sets the guide data if the guide's assessment ID changes", () => {
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

    it("sets the guide data if the guide's locale changes", () => {
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

    it("sets the guide data if the guide's removed", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({guide: null});

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("follows the guide", () => {
    new ComponentHandler(<Component {...props} />);

    expect(props.followGuide).toHaveBeenCalled();
  });

  it("toggles expanded intro", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.findByText("read_more").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeCompetency", () => {
    const component = new ComponentHandler(<Component {...props} />);
    const alt = `${props.guide.competencies[1].name} badge`;
    component.act(() => component.instance.findByProps({alt}).parent.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component", () => {
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
