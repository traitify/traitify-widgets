import {
  getDisplayName,
  loadFont
} from "lib/helpers";
import guessComponent from "lib/helpers/guess-component";

jest.mock("components", ()=>({
  Default: {name: "Default"},
  DimensionComponents: {
    Dimensions: {name: "Dimensions"}
  },
  Results: {name: "Results"},
  SlideDeck: {name: "SlideDeck"},
  TypeComponents: {
    PersonalityBadge: {name: "PersonalityBadge"}
  }
}));

describe("Helpers", ()=>{
  describe("getDisplayName", ()=>{
    it("returns component's displayName", ()=>{
      const name = getDisplayName({displayName: "Traitify", name: "Backup"});

      expect(name).toBe("Traitify");
    });

    it("returns component's name", ()=>{
      const name = getDisplayName({displayName: "Traitify"});

      expect(name).toBe("Traitify");
    });

    it("returns default", ()=>{
      const name = getDisplayName({});

      expect(name).toBe("Component");
    });
  });

  describe("guessComponent", ()=>{
    it("returns default", ()=>{
      const component = guessComponent();

      expect(component.name).toBe("Default");
    });

    it("returns results", ()=>{
      const component = guessComponent("Results");

      expect(component.name).toBe("Results");
    });

    it("returns slide deck", ()=>{
      const component = guessComponent("SlideDeck");

      expect(component.name).toBe("SlideDeck");
    });

    it("returns explicit dimension component", ()=>{
      const component = guessComponent("Dimension.Dimensions");

      expect(component.name).toBe("Dimensions");
    });

    it("returns explicit type component", ()=>{
      const component = guessComponent("Type.PersonalityBadge");

      expect(component.name).toBe("PersonalityBadge");
    });

    it("returns implicit dimension component", ()=>{
      const component = guessComponent("Dimensions", {assessmentType: "DIMENSION_BASED"});

      expect(component.name).toBe("Dimensions");
    });

    it("returns implicit type component", ()=>{
      const component = guessComponent("PersonalityBadge", {assessmentType: "TYPE_BASED"});

      expect(component.name).toBe("PersonalityBadge");
    });

    it("allows misses", ()=>{
      const component = guessComponent("Tacos");

      expect(component).toBeUndefined();
    });
  });

  describe("loadFont", ()=>{
    let originalAppendChild, originalCreateElement, originalQuerySelector;

    beforeAll(()=>{
      originalAppendChild = document.body.appendChild;
      originalCreateElement = document.createElement;
      originalQuerySelector = document.querySelector;

      document.body.appendChild = jest.fn().mockName("appendChild");
      document.createElement = jest.fn(()=>({})).mockName("createElement");
      document.querySelector = jest.fn().mockName("querySelector");
    });

    beforeEach(()=>{
      document.body.appendChild.mockClear();
      document.createElement.mockClear();
      document.querySelector.mockClear();
    });

    afterAll(()=>{
      document.body.appendChild = originalAppendChild;
      document.createElement = originalCreateElement;
      document.querySelector = originalQuerySelector;
    });

    it("adds font", ()=>{
      loadFont();

      expect(document.createElement).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it("doesn't add duplicates", ()=>{
      document.querySelector.mockImplementation(()=>true);
      loadFont();

      expect(document.body.appendChild).not.toHaveBeenCalled();
    });
  });
});
