import {Component} from "components/results/type-based-results/personality-blend";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("components/results/type-based-results/personality-badge", () => ((props) => (
  <div className="mock">Badge - {props.type.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityBlend", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityBlend.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityBlend.updated", component.instance);
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

  it("renders nothing if no blend", () => {
    props.assessment = {...props.assessment, personality_blend: null};
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
