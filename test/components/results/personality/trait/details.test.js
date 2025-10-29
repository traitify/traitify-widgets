import Component from "components/results/personality/trait/details";
import ComponentHandler from "support/component-handler";
import {useAssessment} from "support/container/http";
import assessment from "support/data/assessment/personality/completed";
import useContainer from "support/hooks/use-container";

describe("PersonalityTraitDetails", () => {
  let component;
  let props;

  useContainer({assessmentID: assessment.id});
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
