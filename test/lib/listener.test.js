import Listener from "lib/listener";

describe("Listener", () => {
  let listener;

  beforeEach(() => {
    listener = new Listener();
  });

  describe("constructor", () => {
    it("sets empty data", () => {
      expect(listener.callbacks).toEqual({});
      expect(listener.current).toEqual({});
    });
  });

  describe("clear", () => {
    beforeEach(() => {
      listener.callbacks = {
        "all": [jest.fn(), jest.fn()],
        "default.initialize": [jest.fn(), jest.fn()],
        "another.default.initialize": [jest.fn(), jest.fn()]
      };
      listener.current = {
        "all": true,
        "default.initialize": true
      };
    });

    it("removes everything", () => {
      listener.clear();

      expect(listener.callbacks).toEqual({});
      expect(listener.current).toEqual({});
    });

    it("removes key", () => {
      listener.clear("Default.Initialize");

      expect(listener.callbacks["default.initialize"]).toBeUndefined();
      expect(listener.callbacks["another.default.initialize"]).toHaveLength(2);
      expect(listener.current.all).toEqual(true);
    });
  });

  describe("off", () => {
    it("ignores missing callback", () => {
      const callback = () => {};

      listener.off("Default.Initialize", callback);

      expect(listener.callbacks["default.initialize"]).toBeUndefined();
    });

    it("removes callback", () => {
      const callback = () => {};

      listener.on("Default.Initialize", callback);
      listener.off("Default.Initialize", callback);

      expect(listener.callbacks["default.initialize"]).toBeUndefined();
    });

    it("leaves other callbacks", () => {
      const callbacks = [() => {}, () => {}];

      listener.on("Default.Initialize", callbacks[0]);
      listener.on("Default.Initialize", callbacks[1]);
      listener.off("Default.Initialize", callbacks[0]);

      expect(listener.callbacks["default.initialize"]).toEqual([callbacks[1]]);
    });
  });

  describe("on", () => {
    it("returns off function", () => {
      const off = listener.on("Default.Initialize", () => {});
      off();

      expect(listener.callbacks["default.initialize"]).toBeUndefined();
    });

    it("adds callback", () => {
      const callback = () => {};

      listener.on("Default.Initialize", callback);

      expect(listener.callbacks["default.initialize"]).toEqual([callback]);
    });

    it("calls callback with current value", () => {
      const callback = jest.fn().mockName("callback");

      listener.trigger("Default.Initialize", true);
      listener.on("Default.Initialize", callback);

      expect(callback).toHaveBeenCalledWith(true);
    });

    it("stacks callbacks", () => {
      const callbacks = [() => {}, () => {}];

      listener.on("Default.Initialize", callbacks[0]);
      listener.on("Default.Initialize", callbacks[1]);

      expect(listener.callbacks["default.initialize"]).toEqual(callbacks);
    });
  });

  describe("trigger", () => {
    beforeEach(() => {
      listener.callbacks = {
        "all": [jest.fn(), jest.fn()],
        "default.initialize": [jest.fn(), jest.fn()],
        "another.default.initialize": [jest.fn(), jest.fn()]
      };
    });

    it("calls each regular callback", () => {
      listener.trigger("Default.Initialize", true);

      expect(listener.callbacks["default.initialize"][0]).toHaveBeenCalled();
      expect(listener.callbacks["default.initialize"][1]).toHaveBeenCalled();
    });

    it("calls each all callback", () => {
      listener.trigger("Default.Initialize", true);

      expect(listener.callbacks.all[0]).toHaveBeenCalled();
      expect(listener.callbacks.all[1]).toHaveBeenCalled();
    });

    it("doesn't require any callbacks", () => {
      listener.callbacks = {};
      listener.trigger("Default.Initialize", true);

      expect(listener.value("Default.Initialize")).toEqual(true);
    });

    it("saves current value", () => {
      listener.trigger("Default.Initialize", true);

      expect(listener.current["default.initialize"]).toBe(true);
      expect(listener.value("Default.Initialize")).toEqual(true);
    });
  });
});
