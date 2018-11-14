import {
  getDisplayName,
  loadFont
} from "lib/helpers";

describe("Helpers", () => {
  describe("getDisplayName", () => {
    it("returns component's displayName", () => {
      const name = getDisplayName({displayName: "Traitify", name: "Backup"});

      expect(name).toBe("Traitify");
    });

    it("returns component's name", () => {
      const name = getDisplayName({displayName: "Traitify"});

      expect(name).toBe("Traitify");
    });

    it("returns default", () => {
      const name = getDisplayName({});

      expect(name).toBe("Component");
    });
  });

  describe("loadFont", () => {
    let originalAppendChild;
    let originalCreateElement;
    let originalQuerySelector;

    beforeAll(() => {
      originalAppendChild = document.body.appendChild;
      originalCreateElement = document.createElement;
      originalQuerySelector = document.querySelector;

      document.body.appendChild = jest.fn().mockName("appendChild");
      document.createElement = jest.fn(() => ({})).mockName("createElement");
      document.querySelector = jest.fn().mockName("querySelector");
    });

    beforeEach(() => {
      document.body.appendChild.mockClear();
      document.createElement.mockClear();
      document.querySelector.mockClear();
    });

    afterAll(() => {
      document.body.appendChild = originalAppendChild;
      document.createElement = originalCreateElement;
      document.querySelector = originalQuerySelector;
    });

    it("adds font", () => {
      loadFont();

      expect(document.createElement).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it("doesn't add duplicates", () => {
      document.querySelector.mockImplementation(() => true);
      loadFont();

      expect(document.body.appendChild).not.toHaveBeenCalled();
    });
  });
});
