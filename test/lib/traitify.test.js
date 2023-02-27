/** @jest-environment jsdom */
import Traitify from "lib/traitify";
import {render, unmountComponentAtNode} from "react-dom";

jest.mock("react-dom");

const createElement = (options = {}) => {
  const element = document.createElement("div");

  if(!options.disconnected) {
    document.body.appendChild(element);
  }

  return element;
};

describe("Traitify", () => {
  let traitify;

  beforeEach(() => {
    render.mockClear();
    unmountComponentAtNode.mockClear();

    traitify = new Traitify();
  });

  describe("destroy", () => {
    it("returns traitify", () => {
      const returnValue = traitify.destroy();

      expect(returnValue).toEqual(traitify);
    });

    it("ignores disconnected targets", () => {
      traitify.renderedTargets = {Default: createElement({disconnected: true})};
      traitify.destroy();

      expect(unmountComponentAtNode).not.toHaveBeenCalled();
    });

    it("ignores invalid targets", () => {
      traitify.renderedTargets = {Default: null};
      traitify.destroy();

      expect(unmountComponentAtNode).not.toHaveBeenCalled();
    });

    it("unmounts targets", () => {
      const div = createElement();
      traitify.renderedTargets = {Default: div};
      traitify.destroy();

      expect(unmountComponentAtNode).toHaveBeenCalledWith(div);
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
        expect(render).toHaveBeenCalledTimes(1);
      })
    ));

    it("renders dom target", () => (
      traitify.render(createElement()).then(() => {
        expect(render).toHaveBeenCalledTimes(1);
      })
    ));

    it("renders targets", () => {
      const targets = {
        PersonalityBlend: "#blend",
        PersonalityTraits: "#traits",
        PersonalityTypes: "#types"
      };

      return traitify.render(targets).then(() => {
        expect(render).toHaveBeenCalledTimes(3);
        expect(traitify.renderedTargets).toEqual({
          PersonalityBlend: expect.any(Object),
          PersonalityTraits: expect.any(Object),
          PersonalityTypes: expect.any(Object)
        });
      });
    });

    it("removes dom target's children", () => (
      traitify.render(createElement()).then(() => {
        expect(unmountComponentAtNode).toHaveBeenCalled();
        expect(render).toHaveBeenCalled();
      })
    ));

    it("removes old target's children", () => {
      const target = createElement();

      traitify.renderedTargets = {Default: target, Results: createElement()};

      return traitify.render(target).then(() => {
        expect(unmountComponentAtNode).toHaveBeenCalledTimes(2);
        expect(render).toHaveBeenCalledTimes(1);
      });
    });

    it("removes only connected targets", () => {
      traitify.renderedTargets = {Results: createElement({disconnected: true})};

      return traitify.render(createElement()).then(() => {
        expect(unmountComponentAtNode).toHaveBeenCalledTimes(1);
        expect(render).toHaveBeenCalledTimes(1);
      });
    });
  });
});
