import {act} from "react-test-renderer";
import {Component} from "components/paradox/results/personality/trait/list";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/personality/trait/details", () => ((props) => (
  <div className="mock">Trait - {props.trait.personality_trait.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityTraits", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["getOption", "isReady", "setElement", "translate", "ui"]),
      assessment
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityTraits.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />);
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
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {allowHeaders: true});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with more traits", () => {
    component = new ComponentHandler(<Component {...props} />);
    act(() => { component.findByText("show_more").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityTraits"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => false);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
