import {Component} from "components/results/guide/index";
import CompetencySelect from "components/results/guide/competency-select";
import CompetencyTab from "components/results/guide/competency-tab";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import guideResponse from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Guide", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      followGuide: jest.fn().mockName("followGuide"),
      guide: {
        assessment_id: "xyz",
        locale_key: "es-US",
        ...guideResponse.data.guide
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
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("Guide.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("Guide.updated", component.instance);
    });
  });

  describe("update", () => {
    it("sets the guide data if the guide's assessment ID changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.setGuide = jest.fn().mockName("setGuide");
      component.updateProps({guide: {...component.props.guide, assessment_id: "abc"}});

      expect(component.instance.setGuide).toHaveBeenCalled();
    });

    it("sets the guide data if the guide's locale changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.setGuide = jest.fn().mockName("setGuide");
      component.updateProps({guide: {...component.props.guide, locale_key: "en-US"}});

      expect(component.instance.setGuide).toHaveBeenCalled();
    });

    it("sets the guide data if the guide's removed", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.setGuide = jest.fn().mockName("setGuide");
      component.updateProps({guide: null});

      expect(component.instance.setGuide).toHaveBeenCalled();
    });
  });

  describe("setGuide", () => {
    let componentDidUpdate;

    beforeEach(() => {
      componentDidUpdate = jest.spyOn(Component.prototype, "componentDidUpdate");
      componentDidUpdate.mockImplementation(() => {});
    });

    afterEach(() => {
      componentDidUpdate.mockRestore();
    });

    it("sets the guide data", () => {
      const competenciesLength = props.guide.competencies.length;
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.setGuide();

      expect(component.state.badges).toHaveLength(competenciesLength);
      expect(component.state.competencies).toHaveLength(competenciesLength);
      expect(component.state.displayedCompetency).toBeDefined();
    });

    it("removes the guide data if the guide's removed", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({guide: null});
      component.instance.setGuide();

      expect(component.state.badges).toHaveLength(0);
      expect(component.state.competencies).toHaveLength(0);
      expect(component.state.displayedCompetency).toBeNull();
    });
  });

  describe("competency select", () => {
    beforeEach(() => {
      props = {
        competencies: props.guide.competencies,
        displayedCompetency: props.guide.competencies[0],
        displayCompetency: jest.fn().mockName("displayCompetency"),
        tabBadge: jest.fn().mockName("tabBadge")
      };
    });

    it("renders component", () => {
      const component = new ComponentHandler(<CompetencySelect {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("calls displayCompetency prop with id", () => {
      const component = new ComponentHandler(<CompetencySelect {...props} />);
      const {id} = props.competencies[1];
      component.instance.displayCompetency({target: {value: id}});

      expect(props.displayCompetency).toHaveBeenCalledWith(id);
    });
  });

  describe("competency tab", () => {
    beforeEach(() => {
      props = {
        competency: props.guide.competencies[1],
        displayedCompetency: props.guide.competencies[0],
        displayCompetency: jest.fn().mockName("displayCompetency"),
        tabBadge: jest.fn().mockName("tabBadge")
      };
    });

    it("renders component", () => {
      const component = new ComponentHandler(<CompetencyTab {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("calls displayCompetency prop with id", () => {
      const component = new ComponentHandler(<CompetencyTab {...props} />);
      component.instance.displayCompetency();

      expect(props.displayCompetency).toHaveBeenCalledWith(props.competency.id);
    });
  });

  it("follows the guide", () => {
    new ComponentHandler(<Component {...props} />);

    expect(props.followGuide).toHaveBeenCalled();
  });

  it("toggles expanded intro", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.instance.componentDidUpdate({});
    component.instance.toggleExpandedIntro();

    expect(component.state.showExpandedIntro).toBe(true);
    expect(component.tree).toMatchSnapshot();
  });

  it("updates displayedCompetency", () => {
    const {competencies} = props.guide;
    const component = new ComponentHandler(<Component {...props} />);
    component.instance.componentDidUpdate({});

    expect(component.state.displayedCompetency.id).toBe(competencies[0].id);

    component.instance.displayCompetency(competencies[1].id);
    expect(component.state.displayedCompetency.id).toBe(competencies[1].id);
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.instance.componentDidUpdate({});

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
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({competencies: []});

    expect(component.tree).toMatchSnapshot();
  });
});
