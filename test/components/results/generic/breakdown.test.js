import {act} from "react-test-renderer";
import Component from "components/results/generic/breakdown";
import ComponentHandler from "support/component-handler";
import {mockGenericAssessment, useGenericAssessment} from "support/container/http";
import {useOptions} from "support/container/options";
import assessment from "support/data/assessment/generic/completed";
import useContainer from "support/hooks/use-container";

describe("Results.GenericBreakdown", () => {
  let component;

  useContainer({assessmentID: assessment.id});
  useGenericAssessment(assessment);
  useOptions({surveyType: "generic"});

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "GenericBreakdown.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "GenericBreakdown.updated",
        undefined
      );
    });
  });

  it("toggles question open", async() => {
    component = await ComponentHandler.setup(Component);
    const toggleButton = component.instance.findAll((element) => element.type === "button" && element.props.className === "toggle")[0];
    act(() => toggleButton.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("toggles question closed", async() => {
    component = await ComponentHandler.setup(Component);
    const toggleButton = component.instance.findAll((element) => element.type === "button" && element.props.className === "toggle")[0];
    act(() => toggleButton.props.onClick());
    act(() => toggleButton.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("toggles questions open", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => component.findByText("Show/Hide All").props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("toggles questions closed", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => component.findByText("Show/Hide All").props.onClick());
    act(() => component.findByText("Show/Hide All").props.onClick());

    expect(component.tree).toMatchSnapshot();
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
