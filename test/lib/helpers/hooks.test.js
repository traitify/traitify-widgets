import {createRef, forwardRef} from "react";
import {useDidMount, useDidUpdate, useWindowSize} from "lib/helpers/hooks";
import ComponentHandler from "support/component-handler";

describe("Helpers", () => {
  describe("useDidMount", () => {
    const didMount = jest.fn().mockName("didMount");

    function Component() {
      useDidMount(didMount);

      return null;
    }

    beforeEach(() => {
      didMount.mockClear();
    });

    it("is called on mount", () => {
      new ComponentHandler(<Component />);

      expect(didMount).toHaveBeenCalledTimes(1);
    });

    it("is not called on update", () => {
      const component = new ComponentHandler(<Component />);
      didMount.mockClear();
      component.updateProps();

      expect(didMount).not.toHaveBeenCalled();
    });
  });

  describe("useDidUpdate", () => {
    const didUpdate = jest.fn().mockName("didUpdate");

    function Component() {
      useDidUpdate(didUpdate);

      return null;
    }

    beforeEach(() => {
      didUpdate.mockClear();
    });

    it("is called on update", () => {
      const component = new ComponentHandler(<Component />);
      didUpdate.mockClear();
      component.updateProps();

      expect(didUpdate).toHaveBeenCalledTimes(1);
    });

    it("is not called on moount", () => {
      new ComponentHandler(<Component />);

      expect(didUpdate).not.toHaveBeenCalled();
    });
  });

  describe("useWindowSize", () => {
    describe("listeners", () => {
      let addEventListenerSpy;
      let removeEventListenerSpy;

      function Component() {
        useWindowSize();

        return null;
      }

      beforeAll(() => {
        addEventListenerSpy = jest.spyOn(window, "addEventListener");
        removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
      });

      afterEach(() => {
        addEventListenerSpy.mockClear();
        removeEventListenerSpy.mockClear();
      });

      afterAll(() => {
        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
      });

      it("adds resize event listener", () => {
        new ComponentHandler(<Component />);

        expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      });

      it("removes resize event listener", () => {
        const component = new ComponentHandler(<Component />);
        component.unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      });
    });

    describe("values", () => {
      let originalResizeTo;

      const Component = forwardRef((_, ref) => {
        ref.current = useWindowSize(); // eslint-disable-line no-param-reassign

        return null;
      });

      beforeAll(() => {
        originalResizeTo = window.resizeTo;
        window.resizeTo = function resizeTo(width, height) {
          Object.assign(this, {
            innerWidth: width,
            innerHeight: height,
            outerWidth: width,
            outerHeight: height
          }).dispatchEvent(new this.Event("resize"));
        };
      });

      afterAll(() => {
        window.resizeTo = originalResizeTo;
      });

      it("returns current window size", () => {
        const ref = createRef();
        new ComponentHandler(<Component ref={ref} />);

        expect(ref.current).toEqual([window.innerWidth, window.innerHeight]);
      });

      it("returns updated window size", () => {
        const ref = createRef();
        const component = new ComponentHandler(<Component ref={ref} />);
        component.act(() => window.resizeTo(1000, 2000));

        expect(ref.current).toEqual([1000, 2000]);
      });
    });
  });
});
