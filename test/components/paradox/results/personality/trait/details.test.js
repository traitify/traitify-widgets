import {Component} from "components/paradox/results/personality/trait/details";
import ComponentHandler from "support/component-handler";
import {mockProps} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityTrait", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["setElement", "ui"]),
      trait: assessment.personality_traits[0]
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityTrait.initialized",
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
        "PersonalityTrait.updated",
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
});
