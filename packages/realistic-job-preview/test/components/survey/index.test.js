import {act} from "react-test-renderer";
import mutable from "traitify/lib/common/object/mutable";
import Component from "components/survey";
import Instructions from "components/survey/instructions";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockAssessmentStarted, mockAssessmentSubmit} from "support/container/http";
import _assessment from "support/data/assessment.json";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";

jest.mock("components/survey/instructions", () => (() => <div className="mock">Instructions</div>));

describe("Survey", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.startedAt = assessment.insertedAt;

    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.initialized",
        expect.any(Object)
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.updated",
        expect.any(Object)
      );
    });
  });

  describe("back", () => {
    it("does nothing", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
      act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("next", () => {
    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("start", () => {
    it("renders component", async() => {
      assessment.startedAt = null;
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);
      mockAssessmentStarted(assessment);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });

      await flushAsync();

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("submit", () => {
    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
      mockAssessmentSubmit({...assessment, completedAt: assessment.insertedAt});
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[1].props.onClick(); });

      await flushAsync();

      expect(component.tree).toMatchSnapshot();
    });

    it("renders loading", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
      mockAssessmentSubmit({implementation: () => new Promise(() => {})});
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[1].props.onClick(); });

      await flushAsync();

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing", async() => {
    assessment.completedAt = assessment.insertedAt;
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing without assessment", async() => {
    container.assessmentID = null;
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders question", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.instance.findByType(Instructions).props.onStart(); });

    expect(component.tree).toMatchSnapshot();
  });
});
