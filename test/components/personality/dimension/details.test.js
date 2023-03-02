import Component from "components/personality/dimension/details";
import ComponentHandler from "support/component-handler";
import {mockGuide, useAssessment, useGuide} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

describe("PersonalityDimensionDetails", () => {
  let component;
  let props;

  useContainer();
  useAssessment(assessment);
  useGuide(guide, {assessmentID: assessment.id});

  beforeEach(() => {
    props = {type: assessment.personality_types[0]};
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component, {props});

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionDetails.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component, {props});
      component.updateProps();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionDetails.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component in third person", async() => {
    mockOption("perspective", "thirdPerson");
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without guide", async() => {
    mockGuide(null, {assessmentID: assessment.id});
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without pitfalls", async() => {
    mockOption("disabledComponents", ["PersonalityPitfalls"]);
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });
});
