/** @jest-environment jsdom */
import {createRef} from "react";
import {act} from "react-test-renderer";
import useFullscreen from "lib/hooks/use-fullscreen";
import ComponentHandler from "support/component-handler";
import useWindowMock from "support/hooks/use-window-mock";

describe("useFullscreen", () => {
  let component;

  describe("listeners", () => {
    function Component() {
      useFullscreen();

      return null;
    }

    useWindowMock("addEventListener");
    useWindowMock("removeEventListener");

    it("adds fullscreen event listeners", async() => {
      await ComponentHandler.setup(Component);

      expect(window.addEventListener).toHaveBeenCalledWith("fullscreenchange", expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith("webkitfullscreenchange", expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith("mozfullscreenchange", expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith("MSFullscreenChange", expect.any(Function));
    });

    it("removes fullscreen event listeners", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.unmount(); });

      expect(window.removeEventListener).toHaveBeenCalledWith("fullscreenchange", expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith("webkitfullscreenchange", expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith("mozfullscreenchange", expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith("MSFullscreenChange", expect.any(Function));
    });
  });

  describe("values", () => {
    let element;
    let value;

    function Component(props) {
      value.current = useFullscreen(props.element);

      return null;
    }

    beforeEach(() => {
      element = {clientHeight: 800, clientWidth: 600};
      value = createRef(null);
    });

    describe("default", () => {
      beforeEach(() => {
        document.exitFullscreen = jest.fn().mockName("exitFullscreen").mockImplementation(() => {
          document.fullscreenElement = null;
          window.dispatchEvent(new window.Event("fullscreenchange"));
        });

        element.requestFullscreen = jest.fn().mockName("requestFullscreen").mockImplementation(() => {
          document.fullscreenElement = element;
          window.dispatchEvent(new window.Event("fullscreenchange"));
        });
      });

      afterEach(() => {
        document.exitFullscreen = null;
        document.fullscreenElement = null;
      });

      it("toggles fullscreen off", async() => {
        document.fullscreenElement = element;
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([true, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([false, expect.any(Function)]);
      });

      it("toggles fullscreen on", async() => {
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([false, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([true, expect.any(Function)]);
      });
    });

    describe("microsoft", () => {
      beforeEach(() => {
        document.msExitFullscreen = jest.fn().mockName("exitFullscreen").mockImplementation(() => {
          document.msFullscreenElement = null;
          window.dispatchEvent(new window.Event("MSFullscreenChange"));
        });

        element.msRequestFullscreen = jest.fn().mockName("requestFullscreen").mockImplementation(() => {
          document.msFullscreenElement = element;
          window.dispatchEvent(new window.Event("MSFullscreenChange"));
        });
      });

      afterEach(() => {
        document.msExitFullscreen = null;
        document.msFullscreenElement = null;
      });

      it("toggles fullscreen off", async() => {
        document.msFullscreenElement = element;
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([true, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([false, expect.any(Function)]);
      });

      it("toggles fullscreen on", async() => {
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([false, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([true, expect.any(Function)]);
      });
    });

    describe("mozilla", () => {
      beforeEach(() => {
        document.mozCancelFullScreen = jest.fn().mockName("exitFullscreen").mockImplementation(() => {
          document.mozFullScreenElement = null;
          window.dispatchEvent(new window.Event("mozfullscreenchange"));
        });

        element.mozRequestFullScreen = jest.fn().mockName("requestFullscreen").mockImplementation(() => {
          document.mozFullScreenElement = element;
          window.dispatchEvent(new window.Event("mozfullscreenchange"));
        });
      });

      afterEach(() => {
        document.mozCancelFullScreen = null;
        document.mozFullScreenElement = null;
      });

      it("toggles fullscreen off", async() => {
        document.mozFullScreenElement = element;
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([true, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([false, expect.any(Function)]);
      });

      it("toggles fullscreen on", async() => {
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([false, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([true, expect.any(Function)]);
      });
    });

    describe("webkit", () => {
      beforeEach(() => {
        document.webkitExitFullscreen = jest.fn().mockName("exitFullscreen").mockImplementation(() => {
          document.webkitFullscreenElement = null;
          window.dispatchEvent(new window.Event("webkitfullscreenchange"));
        });

        element.webkitRequestFullscreen = jest.fn().mockName("requestFullscreen").mockImplementation(() => {
          document.webkitFullscreenElement = element;
          window.dispatchEvent(new window.Event("webkitfullscreenchange"));
        });
      });

      afterEach(() => {
        document.webkitExitFullscreen = null;
        document.webkitFullscreenElement = null;
      });

      it("toggles fullscreen off", async() => {
        document.webkitFullscreenElement = element;
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([true, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([false, expect.any(Function)]);
      });

      it("toggles fullscreen on", async() => {
        component = await ComponentHandler.setup(Component, {props: {element}});
        expect(value.current).toEqual([false, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([true, expect.any(Function)]);
      });
    });

    describe("without an element", () => {
      it("toggles fullscreen on", async() => {
        component = await ComponentHandler.setup(Component);
        expect(value.current).toEqual([false, expect.any(Function)]);

        act(() => { value.current[1](); });
        expect(value.current).toEqual([false, expect.any(Function)]);
      });
    });
  });
});
