import {act} from "react-test-renderer";
import Component from "components/results/personality/trait/list";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/personality/trait/details", () => ((props) => (
  <div className="mock">Trait - {props.trait.personality_trait.name}</div>
)));

describe("PersonalityTraitList", () => {
  let component;

  useContainer();
  useAssessment(assessment);

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTraits.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTraits.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", async() => {
    mockOption("showHeaders", true);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with more traits", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.findByText("Show More").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalityTraits"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
