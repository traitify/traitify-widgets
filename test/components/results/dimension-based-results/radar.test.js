import {Component} from "components/results/dimension-based-results/radar";
import Chart from "lib/helpers/canvas-radar-chart";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/helpers/canvas-radar-chart");
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Radar", () => {
  const getContext = jest.fn().mockName("getContext");
  const createNodeMock = () => ({getContext});
  let props;

  beforeEach(() => {
    Chart.mockClear();
    getContext.mockClear();

    props = {
      assessment,
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(props.ui.trigger.mock.calls[0][0]).toBe("Radar.initialized");
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      component.updateProps();

      expect(props.ui.trigger.mock.calls[1][0]).toBe("Radar.updated");
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("renders nothing if not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(Chart.mock.instances).toHaveLength(0);
  });

  it("creates chart when ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
    component.updateProps({
      assessment,
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true)
    });

    expect(Chart.mock.instances).toHaveLength(1);
  });

  it("creates new chart on assessment change", () => {
    const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
    component.updateProps({
      assessment: {
        ...assessment,
        personality_types: [
          {...assessment.personality_types[0], score: 100},
          ...assessment.personality_types.slice(1)
        ]
      }
    });

    expect(Chart.mock.instances).toHaveLength(2);
  });

  describe("resize", () => {
    const byResize = (call) => (call[0] === "resize");
    let originalAddEventListener;
    let originalRemoveEventListener;

    beforeAll(() => {
      originalAddEventListener = window.addEventListener;
      originalRemoveEventListener = window.removeEventListener;
      window.addEventListener = jest.fn().mockName("addEventListener").mockImplementation(originalAddEventListener);
      window.removeEventListener = jest.fn().mockName("removeEventListener").mockImplementation(originalRemoveEventListener);
    });

    beforeEach(() => {
      window.addEventListener.mockClear();
      window.removeEventListener.mockClear();
    });

    afterAll(() => {
      window.addEventListener = originalAddEventListener;
      window.removeEventListener = originalRemoveEventListener;
    });

    it("adds event listener", () => {
      new ComponentHandler(<Component {...props} />, {createNodeMock});
      const addResizeListeners = window.addEventListener.mock.calls.filter(byResize);
      const removeResizeListeners = window.removeEventListener.mock.calls.filter(byResize);

      expect(addResizeListeners).toHaveLength(1);
      expect(removeResizeListeners).toHaveLength(0);
    });

    it("removes event listener", () => {
      const component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      component.unmount();
      const addResizeListeners = window.addEventListener.mock.calls.filter(byResize);
      const removeResizeListeners = window.removeEventListener.mock.calls.filter(byResize);

      expect(addResizeListeners).toHaveLength(1);
      expect(removeResizeListeners).toHaveLength(1);
    });
  });
});
