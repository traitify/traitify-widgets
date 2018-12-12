import {Component} from "components/results/dimension-based-results/dimensions";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/dimension-based-results/dimension", () => ((props) => (
  <div className="mock">Dimension - {props.type.personality_type.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Dimensions", () => {
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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger.mock.calls[0][0]).toBe("Dimensions.initialized");
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger.mock.calls[1][0]).toBe("Dimensions.updated");
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
});
