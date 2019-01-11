import {Component} from "components/results/type-based-results/career-modal";
import ComponentHandler from "support/component-handler";
import careers from "support/json/careers.json";

jest.mock("lib/helpers/icon", () => ((props) => (
  <div className="mock">Icon - {props.icon.iconName}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

const career = {score: careers[0].score, ...careers[0].career};

describe("CareerModal", () => {
  let props;

  beforeEach(() => {
    props = {
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

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerModal.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerModal.updated", component.instance);
    });

    it("follows modal callbacks", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.on).toHaveBeenCalledWith("CareerModal.career", component.instance.setCareer);
      expect(props.ui.on).toHaveBeenCalledWith("CareerModal.hide", component.instance.hide);
      expect(props.ui.on).toHaveBeenCalledWith("CareerModal.show", component.instance.show);
    });

    it("unfollows modal callbacks", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const {instance} = component;
      component.unmount();

      expect(props.ui.off).toHaveBeenCalledWith("CareerModal.career", instance.setCareer);
      expect(props.ui.off).toHaveBeenCalledWith("CareerModal.hide", instance.hide);
      expect(props.ui.off).toHaveBeenCalledWith("CareerModal.show", instance.show);
    });
  });

  describe("actions", () => {
    it("close triggers hide", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.close();

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerModal.hide", component.instance);
    });

    it("hide updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({show: true});
      component.instance.hide();

      expect(component.state.show).toBe(false);
    });

    it("set career updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["CareerModal.career"] = career;
      component.instance.setCareer();

      expect(component.state.career).toBe(career);
    });

    it("show updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.show();

      expect(component.state.show).toBe(true);
    });

    it("toggle legend updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.toggleLegend();

      expect(component.state.showLegend).toBe(true);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({career, show: true});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no career", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({show: true});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not shown", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({career});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders legend", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({career, show: true, showLegend: true});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders unchecked squares if no bright outlooks or green categories", () => {
    const component = new ComponentHandler(<Component {...props} />);
    const sadCareer = {...career, bright_outlooks: [], green_categories: []};
    component.updateState({career: sadCareer, show: true, showLegend: true});

    expect(component.tree).toMatchSnapshot();
  });
});
