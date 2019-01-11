import {Component} from "components/results/type-based-results/career-filter";
import ComponentHandler from "support/component-handler";

jest.mock("lib/helpers/icon", () => ((props) => (
  <div className="mock">Icon - {props.icon.iconName}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("CareerFilter", () => {
  let props;

  beforeEach(() => {
    props = {
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

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerFilter.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerFilter.updated", component.instance);
    });

    it("follows career callbacks", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.on).toHaveBeenCalledWith("Careers.mergeParams", component.instance.mergeParams);
      expect(props.ui.on).toHaveBeenCalledWith("Careers.updateParams", component.instance.updateParams);
    });

    it("unfollows career callbacks", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const {instance} = component;
      component.unmount();

      expect(props.ui.off).toHaveBeenCalledWith("Careers.mergeParams", instance.mergeParams);
      expect(props.ui.off).toHaveBeenCalledWith("Careers.updateParams", instance.updateParams);
    });
  });

  describe("actions", () => {
    it("merge params updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.mergeParams"] = {sort: "title"};
      component.updateState({params: {search: "Engineer", sort: "match"}});
      component.instance.mergeParams();

      expect(component.state.params).toEqual({search: "Engineer", sort: "title"});
    });

    it("toggle filters updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.toggleFilters();

      expect(component.state.showFilters).toBe(true);
    });

    it("update params updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.updateParams"] = {sort: "title"};
      component.updateState({params: {search: "Engineer", sort: "match"}});
      component.instance.updateParams();

      expect(component.state.params).toEqual({sort: "title"});
    });

    it("on change updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({params: {search: "Engineer", sort: "match"}});
      component.instance.onChange({target: {name: "sort", value: "title"}});

      expect(component.state.params).toEqual({search: "Engineer", sort: "title"});
    });

    it("on experience change updates state to add a level", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({params: {experience_levels: "1"}});
      component.instance.onExperienceChange({target: {value: "2"}});

      expect(component.state.params.experience_levels).toBe("1,2");
    });

    it("on experience change updates state from default levels", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.onExperienceChange({target: {value: "1"}});

      expect(component.state.params.experience_levels).toBe("2,3,4,5");
    });

    it("on experience change updates state to default levels", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({params: {experience_levels: "1"}});
      component.instance.onExperienceChange({target: {value: "1"}});

      expect(component.state.params.experience_levels).toBe("1,2,3,4,5");
    });

    it("on submit triggers merge params", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({params: {search: "Engineer"}});
      component.instance.onSubmit({preventDefault: jest.fn().mockName("preventDefault")});

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.mergeParams", component.instance, {
        page: 1,
        search: "Engineer"
      });
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with different icons and style", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({params: {experience_levels: "1,2,3", sort: "title"}, showFilters: true});

    expect(component.tree).toMatchSnapshot();
  });
});
