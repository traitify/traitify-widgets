import {Component} from "components/results/type-based-results/career";
import ComponentHandler from "support/component-handler";
import careers from "support/json/careers.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Career", () => {
  let props;

  beforeEach(() => {
    props = {
      career: {score: careers[0].score, ...careers[0].career},
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

      expect(props.ui.trigger).toHaveBeenCalledWith("Career.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("Career.updated", component.instance);
    });

    it("triggers modal open", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.openModal();

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerModal.career", component.instance, props.career);
      expect(props.ui.trigger).toHaveBeenCalledWith("CareerModal.show", component.instance);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
