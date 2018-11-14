import Widget from "lib/traitify-widget";
import guessComponent from "lib/helpers/guess-component";
import {render, unmountComponentAtNode} from "react-dom";

jest.mock("react-dom");
jest.mock("lib/helpers/guess-component", () => (
  jest.fn((name) => (
    name && name !== "NotFound" && jest.fn(
      () => (<div>{name}</div>)
    ).mockName("Component")
  )).mockName("guessComponent")
));

describe("Widget", () => {
  let ui;
  let widget;

  beforeEach(() => {
    guessComponent.mockClear();
    render.mockClear();

    ui = {on: jest.fn(), traitify: jest.fn()};
    widget = new Widget(ui);
  });

  describe("allowBack", () => {
    it("returns widget", () => {
      const returnValue = widget.allowBack();

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.allowBack();

      expect(widget.options.allowBack).toBe(true);
    });
  });

  describe("allowFullscreen", () => {
    it("returns widget", () => {
      const returnValue = widget.allowFullscreen();

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.allowFullscreen();

      expect(widget.options.allowFullscreen).toBe(true);
    });
  });

  describe("allowInstructions", () => {
    it("returns widget", () => {
      const returnValue = widget.allowInstructions();

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.allowInstructions();

      expect(widget.options.allowInstructions).toBe(true);
    });
  });

  describe("assessmentID", () => {
    it("returns widget", () => {
      const returnValue = widget.assessmentID("abc");

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.assessmentID("abc");

      expect(widget.options.assessmentID).toBe("abc");
    });
  });

  describe("destroy", () => {
    beforeEach(() => {
      unmountComponentAtNode.mockClear();
    });

    it("returns widget", () => {
      const returnValue = widget.destroy();

      expect(returnValue).toEqual(widget);
    });

    it("ignores invalid targets", () => {
      widget.options.targets = {Default: "#not-found"};
      widget.destroy();

      expect(unmountComponentAtNode).not.toHaveBeenCalled();
    });

    it("unmounts targets", () => {
      const div = document.createElement("div");
      widget.options.targets = {Default: div};
      widget.destroy();

      expect(unmountComponentAtNode).toHaveBeenCalledWith(div);
    });
  });

  describe("disableBack", () => {
    it("returns widget", () => {
      const returnValue = widget.disableBack();

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.disableBack();

      expect(widget.options.allowBack).toBe(false);
    });
  });

  describe("disableFullscreen", () => {
    it("returns widget", () => {
      const returnValue = widget.disableFullscreen();

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.disableFullscreen();

      expect(widget.options.allowFullscreen).toBe(false);
    });
  });

  describe("disableInstructions", () => {
    it("returns widget", () => {
      const returnValue = widget.disableInstructions();

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.disableInstructions();

      expect(widget.options.allowInstructions).toBe(false);
    });
  });

  describe("locale", () => {
    it("returns widget", () => {
      const returnValue = widget.locale("es-us");

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.locale("es-US");

      expect(widget.options.locale).toBe("es-us");
    });
  });

  describe("on", () => {
    it("returns widget", () => {
      const returnValue = widget.on("Default.Initialize", () => {});

      expect(returnValue).toEqual(widget);
    });

    it("adds callback", () => {
      const callback = () => {};

      widget.on("Default.Initialize", callback);

      expect(ui.on).toHaveBeenCalledWith(`Widget-${widget.id}.Default.Initialize`, callback);
    });
  });

  describe("perspective", () => {
    it("returns widget", () => {
      const returnValue = widget.perspective("firstPerson");

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.perspective("firstPerson");

      expect(widget.options.perspective).toBe("firstPerson");
    });
  });

  describe("refresh", () => {
    beforeEach(() => {
      widget.render = jest.fn();
    });

    it("returns widget", () => {
      const returnValue = widget.refresh();

      expect(returnValue).toEqual(widget);
    });

    it("triggers render", () => {
      widget.refresh();

      expect(widget.render).toHaveBeenCalled();
    });
  });

  describe("render", () => {
    let originalQuerySelector;

    beforeAll(() => {
      originalQuerySelector = document.querySelector;
      document.querySelector = jest.fn((selector) => (
        selector && selector !== "#not-found" && selector
      )).mockName("querySelector");
    });

    afterAll(() => {
      document.querySelector = originalQuerySelector;
    });

    it("requires a component", () => {
      const result = widget.target("#results").render("NotFound");

      return expect(result).rejects.toThrow("Could not find component for NotFound");
    });

    it("requires a target", () => {
      const result = widget.render();

      return expect(result).rejects.toThrow("You did not specify a target");
    });

    it("requires a valid target", () => {
      const result = widget.target("#not-found").render();

      return expect(result).rejects.toThrow("Could not select target for Default");
    });

    it("renders string target", (done) => {
      widget.options.target = "#results";
      widget.render().then(() => {
        expect(render).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it("renders dom target", (done) => {
      widget.options.target = {nodeName: "div"};
      widget.render().then(() => {
        expect(render).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it("renders targets", (done) => {
      widget.options.targets = {
        PersonalityBlend: "#blend",
        PersonalityTraits: "#traits",
        PersonalityTypes: "#types"
      };
      widget.render().then(() => {
        expect(render).toHaveBeenCalledTimes(3);
        done();
      });
    });

    it("removes dom target's children", (done) => {
      const removeChild = jest.fn(function() { this.firstChild = null; });
      widget.options.target = {
        removeChild,
        firstChild: {nodeName: "div"},
        nodeName: "div"
      };
      widget.render().then(() => {
        expect(render).toHaveBeenCalled();
        done();
      });
    });
  });

  describe("target", () => {
    it("returns widget", () => {
      const returnValue = widget.target("#results");

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.target("#results");

      expect(widget.options.target).toBe("#results");
    });
  });

  describe("targets", () => {
    it("returns widget", () => {
      const returnValue = widget.targets({Results: "#results"});

      expect(returnValue).toEqual(widget);
    });

    it("updates option", () => {
      widget.targets({Results: "#results"});

      expect(widget.options.targets).toEqual({Results: "#results"});
    });
  });
});
