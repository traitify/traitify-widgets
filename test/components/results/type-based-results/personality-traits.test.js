import {Component} from "components/results/type-based-results/personality-traits";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("components/results/type-based-results/personality-trait", () => ((props) => (
  <div className="mock">Trait - {props.trait.personality_trait.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityTraits", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTraits.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTraits.updated", component.instance);
    });

    it("triggers show less", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({showMore: true});
      component.instance.onClick();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTraits.showLess", component.instance);
    });

    it("triggers show more", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.onClick();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTraits.showMore", component.instance);
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

  it("renders more traits", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({showMore: true});

    expect(component.tree).toMatchSnapshot();
  });
});
