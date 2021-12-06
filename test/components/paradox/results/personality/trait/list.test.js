import {Component} from "components/paradox/results/personality/trait/list";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/personality/trait/details", () => ((props) => (
  <div className="mock">Trait - {props.trait.personality_trait.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityTraits", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
      setElement: jest.fn().mockName("setElement"),
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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityTraits.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityTraits.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {allowHeaders: true});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with translation definitions", () => {
    mockOptions(props.getOption, {perspective: "thirdPerson"});
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
