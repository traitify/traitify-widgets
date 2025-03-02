/** @jest-environment jsdom */
import {createRef} from "react";
import {act} from "react-test-renderer";
import useElementSize from "lib/hooks/use-element-size";
import ComponentHandler from "support/component-handler";
import useResizeMock from "support/hooks/use-resize-mock";
import useWindowMock from "support/hooks/use-window-mock";

describe("useElementSize", () => {
  let component;
  let element;
  let size;

  function Component(props) {
    size.current = useElementSize(props.element);

    return null;
  }

  beforeEach(() => {
    element = {clientHeight: 800, clientWidth: 600};
    size = createRef(null);
  });

  describe("listeners", () => {
    useWindowMock("addEventListener");
    useWindowMock("removeEventListener");

    it("adds resize event listener", async() => {
      await ComponentHandler.setup(Component, {wrap: false});

      expect(window.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    });

    it("removes resize event listener", async() => {
      component = await ComponentHandler.setup(Component, {wrap: false});
      component.unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    });

    it("updates listeners for new element", async() => {
      component = await ComponentHandler.setup(Component, {wrap: false});
      window.addEventListener.mockClear();
      window.removeEventListener.mockClear();
      component.updateProps({element});

      expect(size.current).toEqual([600, 800]);
      expect(window.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    });
  });

  describe("values", () => {
    useResizeMock();

    it("returns blank size", async() => {
      component = await ComponentHandler.setup(Component, {wrap: false});

      expect(size.current).toEqual([0, 0]);
    });

    it("returns current element size", async() => {
      component = await ComponentHandler.setup(Component, {props: {element}, wrap: false});

      expect(size.current).toEqual([600, 800]);
    });

    it("returns updated element size", async() => {
      component = await ComponentHandler.setup(Component, {props: {element}, wrap: false});
      element.clientWidth = 700;
      act(() => window.resizeTo(1000, 2000));

      expect(size.current).toEqual([700, 800]);
    });
  });
});
