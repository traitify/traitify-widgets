import {Component} from "components/results/type-based-results/personality-types";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/type-based-results/personality-type-bar-chart", () => (() => (<div className="mock">Personality Type Bar Chart</div>)));
jest.mock("components/results/type-based-results/personality-type-slider", () => (() => (<div className="mock">Personality Type Slider</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityTypes", () => {
  let props;

  beforeEach(() => {
    props = {
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypes.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypes.updated", component.instance);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
