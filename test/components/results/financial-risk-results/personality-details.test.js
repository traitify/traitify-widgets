import {Component} from "components/results/financial-risk-results/personality-details";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/financial-risk.json";

jest.mock("lib/helpers", () => ({
  detailWithPerspective: jest.fn().mockImplementation(
    (options) => options.base[options.name] || options.name
  ),
  detailsWithPerspective: jest.fn().mockImplementation(
    (options) => [options.base[options.name] || options.name]
  )
}));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityDetails", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDetails.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDetails.updated", component.instance);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", () => {
    props.assessment = {...props.assessment, archetype: null};
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
