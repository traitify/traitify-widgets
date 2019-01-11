import {Component} from "components/results/type-based-results/careers";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/type-based-results/career-filter", () => (() => (<div className="mock">Career Filter</div>)));
jest.mock("components/results/type-based-results/career-modal", () => (() => (<div className="mock">Career Modal</div>)));
jest.mock("components/results/type-based-results/career-results", () => (() => (<div className="mock">Career Results</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Careers", () => {
  let props;

  beforeEach(() => {
    props = {
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

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.updated", component.instance);
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
});
