import Component from "components/personality/trait/details";
import ComponentHandler from "support/component-handler";
import {useAssessment} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";

describe("PersonalityTrait", () => {
  let component;
  let props;

  useContainer();
  useAssessment(assessment);

  beforeEach(() => {
    props = {trait: assessment.personality_traits[0]};
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component, {props});

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTrait.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component, {props});
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTrait.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });
});
