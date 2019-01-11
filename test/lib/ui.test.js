import I18n from "lib/i18n";
import Traitify from "lib/traitify";
import UI from "lib/traitify-ui";
import Widget from "lib/traitify-widget";

jest.mock("lib/helpers/guess-component", () => {});
jest.mock("lib/i18n");
jest.mock("lib/i18n-data", () => {});
jest.mock("lib/traitify");
jest.mock("lib/traitify-widget");

describe("UI", () => {
  let traitify;
  let ui;

  beforeEach(() => {
    Widget.mockClear();

    traitify = new Traitify();
    traitify.i18n = new I18n();
    traitify.i18n.data = {"en-us": {}};
    ui = new UI(traitify);
  });

  describe("constructor", () => {
    it("has default imageHost", () => {
      expect(ui.options.imageHost).toBe("https://images.traitify.com");
    });

    it("copies i18n from Traitify", () => {
      expect(ui.i18n).toBeInstanceOf(I18n);
    });

    it("sets shared data", () => {
      expect(ui.current).toEqual({"I18n.setLocale": "en-us"});
      expect(ui.requests).toEqual({});
    });
  });

  describe("component", () => {
    it("merges options", () => {
      ui.options = {abc: "original", xyz: "original"};
      ui.component({xyz: "override"});

      expect(Widget).toHaveBeenCalledWith(ui, {abc: "original", xyz: "override"});
    });

    it("returns a component", () => {
      const component = ui.component();

      expect(component).toBeInstanceOf(Widget);
    });
  });

  describe("off", () => {
    it("returns ui", () => {
      const returnValue = ui.off("Default.Initialize", () => {});

      expect(returnValue).toEqual(ui);
    });

    it("removes callback", () => {
      const callback = () => {};

      ui.on("Default.Initialize", callback);
      ui.off("Default.Initialize", callback);

      expect(ui.callbacks["default.initialize"]).toBeUndefined();
    });

    it("leaves other callbacks", () => {
      const callbacks = [() => {}, () => {}];

      ui.on("Default.Initialize", callbacks[0]);
      ui.on("Default.Initialize", callbacks[1]);
      ui.off("Default.Initialize", callbacks[0]);

      expect(ui.callbacks["default.initialize"]).toEqual([callbacks[1]]);
    });
  });

  describe("on", () => {
    it("returns ui", () => {
      const returnValue = ui.on("Default.Initialize", () => {});

      expect(returnValue).toEqual(ui);
    });

    it("adds callback", () => {
      const callback = () => {};

      ui.on("Default.Initialize", callback);

      expect(ui.callbacks["default.initialize"]).toEqual([callback]);
    });

    it("stacks callbacks", () => {
      const callbacks = [() => {}, () => {}];

      ui.on("Default.Initialize", callbacks[0]);
      ui.on("Default.Initialize", callbacks[1]);

      expect(ui.callbacks["default.initialize"]).toEqual(callbacks);
    });
  });

  describe("setImagePack", () => {
    it("returns ui", () => {
      const returnValue = ui.setImagePack("linear");

      expect(returnValue).toEqual(ui);
    });

    it("updates option", () => {
      ui.setImagePack("linear");

      expect(ui.options.imagePack).toBe("linear");
    });
  });

  describe("setLocale", () => {
    it("returns ui", () => {
      const returnValue = ui.setLocale("es-us");

      expect(returnValue).toEqual(ui);
    });

    it("updates locale", () => {
      ui.setLocale("en-US");

      expect(ui.locale).toBe("en-us");
    });

    it("ignores bad input", () => {
      ui.setLocale("espn");

      expect(ui.locale).toBe("en-us");
    });
  });

  describe("trigger", () => {
    beforeEach(() => {
      ui.callbacks = {
        "all": [jest.fn(), jest.fn()],
        "default.initialize": [jest.fn(), jest.fn()],
        "widget-x.default.initialize": [jest.fn(), jest.fn()],
        "widget-y.default.initialize": [jest.fn(), jest.fn()]
      };
    });

    it("returns ui", () => {
      const returnValue = ui.trigger("Default.Initialize", {});

      expect(returnValue).toEqual(ui);
    });

    it("calls each widget callback", () => {
      ui.trigger("Default.Initialize", {props: {widgetID: "x"}});

      expect(ui.callbacks["widget-x.default.initialize"][0]).toHaveBeenCalled();
      expect(ui.callbacks["widget-x.default.initialize"][1]).toHaveBeenCalled();
      expect(ui.callbacks["widget-y.default.initialize"][0]).not.toHaveBeenCalled();
    });

    it("calls each regular callback", () => {
      ui.trigger("Default.Initialize", {});

      expect(ui.callbacks["default.initialize"][0]).toHaveBeenCalled();
      expect(ui.callbacks["default.initialize"][1]).toHaveBeenCalled();
    });

    it("calls each all callback", () => {
      ui.trigger("Default.Initialize", {});

      expect(ui.callbacks["default.initialize"][0]).toHaveBeenCalled();
      expect(ui.callbacks["default.initialize"][1]).toHaveBeenCalled();
    });

    it("doesn't require any callbacks", () => {
      ui.callbacks = {};
      const returnValue = ui.trigger("Default.Initialize", {});

      expect(returnValue).toEqual(ui);
    });

    it("saves current", () => {
      ui.trigger("Default.Initialize", {}, true);

      expect(ui.current["Default.Initialize"]).toBe(true);
    });
  });
});
