import Widget from "lib/widget";

jest.mock("traitify/lib/renderer");
jest.mock("components/default", () => (() => <div className="mock">Default</div>));
jest.mock("components/results", () => (() => <div className="mock">Results</div>));

describe("Widget", () => {
  let widget;

  beforeEach(() => {
    widget = new Widget();
  });

  describe("destroy", () => {
    it("returns widget", () => {
      const returnValue = widget.destroy();

      expect(returnValue).toEqual(widget);
      expect(widget.renderer.destroy).toHaveBeenCalled();
    });
  });

  describe("updateLocale", () => {
    it("renders default targets", () => {
      widget.updateLocale("es-us");

      expect(widget.options.locale).toBe("es-us");
    });
  });

  describe("render", () => {
    it("renders default targets", () => {
      widget.render();

      expect(widget.renderer.render).toHaveBeenCalled();
    });

    it("renders targets", () => {
      const targets = {
        "Personality.Trait.List": "#traits",
        "Personality.Type.List": "#types"
      };

      widget.render(targets);

      expect(widget.renderer.render).toHaveBeenCalled();
    });
  });
});
