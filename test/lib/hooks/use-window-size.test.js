/** @jest-environment jsdom */
import {createRef} from "react";
import {act} from "react-test-renderer";
import useWindowSize from "lib/hooks/use-window-size";
import ComponentHandler from "support/component-handler";
import useResizeMock from "support/hooks/use-resize-mock";
import useWindowMock from "support/hooks/use-window-mock";

describe("useWindowSize", () => {
  let component;

  describe("listeners", () => {
    function Component() {
      useWindowSize();

      return null;
    }

    useWindowMock("addEventListener");
    useWindowMock("removeEventListener");

    it("adds resize event listener", async() => {
      await ComponentHandler.setup(Component);

      expect(window.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    });

    it("removes resize event listener", async() => {
      component = await ComponentHandler.setup(Component);
      component.unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    });
  });

  describe("values", () => {
    let size;

    function Component() {
      size.current = useWindowSize();

      return null;
    }

    useResizeMock();

    beforeEach(() => {
      size = createRef(null);
    });

    it("returns current window size", async() => {
      await ComponentHandler.setup(Component);

      expect(size.current).toEqual([window.innerWidth, window.innerHeight]);
    });

    it("returns updated window size", async() => {
      await ComponentHandler.setup(Component);
      act(() => window.resizeTo(1000, 2000));

      expect(size.current).toEqual([1000, 2000]);
    });
  });
});
