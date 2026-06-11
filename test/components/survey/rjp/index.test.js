/** @jest-environment jsdom */
/* eslint-disable no-console */
import {act} from "react-test-renderer";
import Component from "components/survey/rjp";
import Instructions from "components/survey/rjp/instructions";
import getCacheKey from "lib/common/get-cache-key";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {
  mockRjpAssessment as mockAssessment,
  mockRjpStart,
  mockRjpSubmit
} from "support/container/http";
import {mockOption} from "support/container/options";
import _assessment from "support/data/assessment/rjp/incomplete";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";

jest.mock("components/survey/rjp/instructions", () => (() => <div className="mock">Instructions</div>));

const completedAt = "2024-02-01T00:00:00Z";

describe("Survey.RJP", () => {
  let assessment;
  let assessmentCacheKey;
  let component;

  useContainer();

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    assessmentCacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us"});

    mockAssessment(assessment);
    mockOption("surveyType", "rjp");
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

  describe("start", () => {
    it("calls start mutation when not yet started", async() => {
      assessment.startedAt = null;
      mockAssessment(assessment);
      const mock = mockRjpStart(assessment);
      component = await ComponentHandler.setup(Component);
      await act(async() => { component.instance.findByType(Instructions).props.onStart(); });

      expect(mock.called).toBe(1);
    });

    it("does not call start when already started", async() => {
      const mock = mockRjpStart(assessment);
      component = await ComponentHandler.setup(Component);
      await act(async() => { component.instance.findByType(Instructions).props.onStart(); });

      expect(mock.called).toBe(0);
    });
  });

  describe("back", () => {
    it("renders previous question", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
      act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("submit", () => {
    let originalWarn;

    beforeAll(() => { originalWarn = console.warn; });
    afterAll(() => { console.warn = originalWarn; });

    beforeEach(async() => {
      console.warn = jest.fn().mockName("warn");
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
    });

    it("submits query", async() => {
      const mock = mockRjpSubmit({implementation: () => new Promise(() => {})});
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[1].props.onClick(); });
      await flushAsync();

      expect(mock.calls).toMatchSnapshot();
    });

    it("updates cached state", async() => {
      mockAssessment({...assessment, completedAt});
      const mock = mockRjpSubmit({...assessment, completedAt});
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[1].props.onClick(); });
      await flushAsync();

      expect(container.cache.set).toHaveBeenCalledWith(assessmentCacheKey, expect.any(Object));
      expect(mock.called).toBe(1);
    });
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing without assessment", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results ready", async() => {
    mockAssessment({...assessment, completedAt});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders question", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.instance.findByType(Instructions).props.onStart(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("renders next question", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.instance.findByType(Instructions).props.onStart(); });
    act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });
});
