import {
  careerOption,
  dangerousProps,
  detailWithPerspective,
  getDisplayName,
  loadFont
} from "lib/helpers";
import assessment from "support/json/assessment/dimension-based.json";

describe("Helpers", () => {
  describe("careerOption", () => {
    const options = {careerOptions: {perPage: 20}};
    const ui = {options: {careerOptions: {perPage: 30}}};

    it("checks prop", () => {
      const props = {perPage: 10};

      expect(careerOption(props, "perPage")).toBe(10);
    });

    it("prioritizes prop", () => {
      const props = {perPage: 10, options};

      expect(careerOption(props, "perPage")).toBe(10);
    });

    it("checks options", () => {
      const props = {options};

      expect(careerOption(props, "perPage")).toBe(20);
    });

    it("prioritizes options", () => {
      const props = {options, ui};

      expect(careerOption(props, "perPage")).toBe(20);
    });

    it("checks ui", () => {
      const props = {ui};

      expect(careerOption(props, "perPage")).toBe(30);
    });

    it("gives up", () => {
      expect(careerOption({}, "perPage")).toBeUndefined();
    });
  });

  describe("dangerousProps", () => {
    it("sets dangerouslySetInnerHTML", () => {
      const props = dangerousProps({html: "<i>Danger</i>"});

      expect(props).toEqual({dangerouslySetInnerHTML: {__html: "<i>Danger</i>"}});
    });

    it("returns extra props", () => {
      const props = dangerousProps({className: "extra", html: "<i>Danger</i>"});

      expect(props.className).toEqual("extra");
    });
  });

  describe("detailWithPerspective", () => {
    let options;

    beforeEach(() => {
      options = {
        base: assessment.personality_types[0].personality_type,
        name: "description"
      };
    });

    it("defaults to first person", () => {
      const detail = options.base.details.find((d) => (d.title === "first_person_description"));
      const value = detailWithPerspective(options);

      expect(value).toBe(detail.body);
    });

    it("shows third person", () => {
      options.perspective = "thirdPerson";
      const detail = options.base.details.find((d) => (d.title === "third_person_description"));
      const value = detailWithPerspective(options);

      expect(value).toBe(detail.body);
    });

    it("falls back to third person", () => {
      const detail = options.base.details.find((d) => (d.title === "third_person_description"));
      const details = options.base.details.filter((d) => (d.title !== "first_person_description"));
      options.base = {...options.base, details};
      options.perspective = "firstPerson";
      const value = detailWithPerspective(options);

      expect(value).toBe(detail.body);
    });

    it("falls back to first person", () => {
      const detail = options.base.details.find((d) => (d.title === "first_person_description"));
      const details = options.base.details.filter((d) => (d.title !== "third_person_description"));
      options.base = {...options.base, details};
      options.perspective = "thirdPerson";
      const value = detailWithPerspective(options);

      expect(value).toBe(detail.body);
    });

    it("falls back to description", () => {
      options.base = {...options.base, details: []};
      const value = detailWithPerspective(options);

      expect(value).toBe(options.base.description);
    });
  });

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
