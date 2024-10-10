/** @jest-environment jsdom */
import {createRoot} from "react-dom/client";
import Traitify from "lib/traitify";

jest.mock("react-dom/client");
jest.mock("components/results/personality/trait/list", () => (() => <div className="mock">Personality Traits</div>));
jest.mock("components/results/personality/type/list", () => (() => <div className="mock">Personality Types</div>));

const createElement = () => document.createElement("div");

describe("Traitify", () => {
  let traitify;

  beforeEach(() => {
    createRoot.mockImplementation(() => ({
      render: jest.fn().mockName("render"),
      unmount: jest.fn().mockName("unmount")
    }));

    traitify = new Traitify();
  });

  afterEach(() => {
    createRoot.mockClear();
  });

  describe("destroy", () => {
    it("returns traitify", () => {
      const returnValue = traitify.destroy();

      expect(returnValue).toEqual(traitify);
    });

    it("ignores unmounted targets", () => {
      traitify.renderer.renderedTargets = {Default: {target: createElement()}};
      traitify.destroy();

      expect(traitify.renderer.renderedTargets).toEqual({});
    });

    it("ignores invalid targets", () => {
      traitify.renderer.renderedTargets = {Default: null};
      traitify.destroy();

      expect(traitify.renderer.renderedTargets).toEqual({});
    });

    it("unmounts targets", () => {
      const div = createElement();
      const root = createRoot();
      traitify.renderer.renderedTargets = {Default: {root, target: div}};
      traitify.destroy();

      expect(root.unmount).toHaveBeenCalled();
    });
  });

  describe("render", () => {
    let originalQuerySelector;

    beforeAll(() => {
      originalQuerySelector = document.querySelector;
      document.querySelector = jest.fn((selector) => (
        selector && selector !== "#not-found" && createElement()
      )).mockName("querySelector");
    });

    afterAll(() => {
      document.querySelector = originalQuerySelector;
    });

    it("requires a component", () => {
      const result = traitify.render({NotFound: "#results"});

      return expect(result).rejects.toThrow("Could not find component for NotFound");
    });

    it("requires a target", () => {
      const result = traitify.render();

      return expect(result).rejects.toThrow("You did not specify a target");
    });

    it("requires a valid target", () => {
      const result = traitify.render("#not-found");

      return expect(result).rejects.toThrow("Could not select target for Default");
    });

    it("renders string target", () => (
      traitify.render("#results").then(() => {
        expect(createRoot).toHaveBeenCalledTimes(1);
      })
    ));

    it("renders dom target", () => (
      traitify.render(createElement()).then(() => {
        expect(createRoot).toHaveBeenCalledTimes(1);
      })
    ));

    it("renders targets", () => {
      const targets = {
        "Personality.Trait.List": "#traits",
        "Personality.Type.List": "#types"
      };

      return traitify.render(targets).then(() => {
        expect(createRoot).toHaveBeenCalledTimes(2);
        expect(traitify.renderer.renderedTargets).toEqual({
          "Personality.Trait.List": expect.any(Object),
          "Personality.Type.List": expect.any(Object)
        });
      });
    });

    it("removes old target's children", () => {
      const target = createElement();
      const root1 = createRoot();
      const root2 = createRoot();

      traitify.renderer.renderedTargets = {
        Default: {root: root1, target},
        Results: {root: root2, target: createElement()}
      };

      return traitify.render(target).then(() => {
        expect(root1.unmount).not.toHaveBeenCalled();
        expect(root2.unmount).toHaveBeenCalled();
        expect(createRoot).toHaveBeenCalledTimes(3);
      });
    });
  });
});
