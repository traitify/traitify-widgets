import {act} from "react-test-renderer";
import Component from "components/results/guide/client";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockGuide, useAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import assessment from "support/data/assessment/personality/completed";
import _guide from "support/data/guide.json";
import useContainer from "support/hooks/use-container";

describe("Results.Guide.Client", () => {
  let component;
  let guide;

  useContainer({assessmentID: assessment.id});
  useAssessment(assessment);

  beforeEach(() => {
    guide = mutable({..._guide, assessmentId: assessment.id});

    mockGuide(guide);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "ClientGuide.initialized",
        {activeSection: null}
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "ClientGuide.updated",
        {activeSection: undefined}
      );
    });
  });

  it("toggles sequence content", async() => {
    component = await ComponentHandler.setup(Component);
    const sequence = guide.client.sections[0].questionSequences[1];
    const button = component.findByText(sequence.title, {exact: false})
      .parent.parent.findByType("button");
    act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeSection", async() => {
    component = await ComponentHandler.setup(Component);
    const text = guide.client.sections[1].title;
    const button = component.instance
      .find((element) => element.children[0] === text && element.type === "span")
      .parent;
    act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeSection through select", async() => {
    component = await ComponentHandler.setup(Component);
    const value = guide.client.sections[1].id;
    act(() => component.instance.findByType("select").props.onChange({target: {value}}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["Guide"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if guide not ready", async() => {
    mockGuide(null, {assessmentID: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no sections", async() => {
    guide.client.sections = [];
    mockGuide(guide);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
