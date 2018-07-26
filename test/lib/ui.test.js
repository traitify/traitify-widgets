import UI from "lib/traitify-ui";
import Widget from "lib/traitify-widget";

jest.mock("lib/traitify-widget");

describe("UI", ()=>{
  let ui;

  beforeEach(()=>{
    Widget.mockClear();

    ui = new UI({});
  });

  describe("component", ()=>{
    it("merges options", ()=>{
      ui.options = {abc: "original", xyz: "original"};
      ui.component({xyz: "override"});

      expect(Widget).toHaveBeenCalledWith(ui, {abc: "original", xyz: "override"});
    });

    it("returns a component", ()=>{
      const component = ui.component();

      expect(component).toBeInstanceOf(Widget);
    });
  });

  describe("on", ()=>{
    it("returns ui", ()=>{
      const returnValue = ui.on("Default.Initialize", ()=>{});

      expect(returnValue).toEqual(ui);
    });

    it("adds callback", ()=>{
      const callback = ()=>{};

      ui.on("Default.Initialize", callback);

      expect(ui.callbacks["default.initialize"]).toEqual([callback]);
    });

    it("stacks callbacks", ()=>{
      const callbacks = [()=>{}, ()=>{}];

      ui.on("Default.Initialize", callbacks[0]);
      ui.on("Default.Initialize", callbacks[1]);

      expect(ui.callbacks["default.initialize"]).toEqual(callbacks);
    });
  });

  describe("setImagePack", ()=>{
    it("returns ui", ()=>{
      const returnValue = ui.setImagePack("linear");

      expect(returnValue).toEqual(ui);
    });

    it("updates option", ()=>{
      ui.setImagePack("linear");

      expect(ui.options.imagePack).toBe("linear");
    });
  });

  describe("trigger", ()=>{
    beforeEach(()=>{
      ui.callbacks = {
        "all": [jest.fn(), jest.fn()],
        "default.initialize": [jest.fn(), jest.fn()],
        "widget-x.default.initialize": [jest.fn(), jest.fn()],
        "widget-y.default.initialize": [jest.fn(), jest.fn()]
      };
    });

    it("returns ui", ()=>{
      const returnValue = ui.trigger("Default.Initialize", {});

      expect(returnValue).toEqual(ui);
    });

    it("calls each widget callback", ()=>{
      ui.trigger("Default.Initialize", {props: {widgetID: "x"}});

      expect(ui.callbacks["widget-x.default.initialize"][0]).toHaveBeenCalled();
      expect(ui.callbacks["widget-x.default.initialize"][1]).toHaveBeenCalled();
      expect(ui.callbacks["widget-y.default.initialize"][0]).not.toHaveBeenCalled();
    });

    it("calls each regular callback", ()=>{
      ui.trigger("Default.Initialize", {});

      expect(ui.callbacks["default.initialize"][0]).toHaveBeenCalled();
      expect(ui.callbacks["default.initialize"][1]).toHaveBeenCalled();
    });

    it("calls each all callback", ()=>{
      ui.trigger("Default.Initialize", {});

      expect(ui.callbacks["default.initialize"][0]).toHaveBeenCalled();
      expect(ui.callbacks["default.initialize"][1]).toHaveBeenCalled();
    });

    it("doesn't require any callbacks", ()=>{
      ui.callbacks = {};
      const returnValue = ui.trigger("Default.Initialize", {});

      expect(returnValue).toEqual(ui);
    });
  });
});
