import Component from "components/results/generic/heading";
import ComponentHandler from "support/component-handler";
import {mockGenericAssessment, useGenericAssessment} from "support/container/http";
import {useOptions} from "support/container/options";
import assessment from "support/data/assessment/generic/completed";
import useContainer from "support/hooks/use-container";

describe("Results.GenericHeading", () => {
  let component;

  useContainer({assessmentID: assessment.id});
  useGenericAssessment(assessment);
  useOptions({surveyType: "generic"});

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "GenericHeading.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "GenericHeading.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockGenericAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
