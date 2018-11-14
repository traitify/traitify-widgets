import guessComponent from "lib/helpers/guess-component";
import componentFromAssessment from "lib/helpers/component-from-assessment";

jest.mock("components", () => ({
  Default: {name: "Default"},
  DimensionComponents: {
    Dimensions: {name: "Dimensions"},
    PersonalityType: {name: "PersonalityType"}
  },
  Results: {name: "Results"},
  SlideDeck: {name: "SlideDeck"},
  TypeComponents: {
    PersonalityBadge: {name: "PersonalityBadge"},
    PersonalityType: {name: "PersonalityType"}
  }
}));

jest.mock("lib/helpers/component-from-assessment");

describe("Helpers", () => {
  describe("guessComponent", () => {
    it("returns default", () => {
      const component = guessComponent();

      expect(component.name).toBe("Default");
    });

    it("returns results", () => {
      const component = guessComponent("Results");

      expect(component.name).toBe("Results");
    });

    it("returns slide deck", () => {
      const component = guessComponent("SlideDeck");

      expect(component.name).toBe("SlideDeck");
    });

    it("returns explicit dimension component", () => {
      const component = guessComponent("Dimension.Dimensions");

      expect(component.name).toBe("Dimensions");
    });

    it("returns explicit type component", () => {
      const component = guessComponent("Type.PersonalityBadge");

      expect(component.name).toBe("PersonalityBadge");
    });

    it("returns implicit dimension component", () => {
      const component = guessComponent("Dimensions", {assessmentType: "DIMENSION_BASED"});

      expect(component.name).toBe("Dimensions");
    });

    it("returns implicit type component", () => {
      const component = guessComponent("PersonalityBadge", {assessmentType: "TYPE_BASED"});

      expect(component.name).toBe("PersonalityBadge");
    });

    it("returns ambiguous component", () => {
      componentFromAssessment.mockClear();
      guessComponent("PersonalityType");

      expect(componentFromAssessment).toHaveBeenCalledWith({
        DIMENSION_BASED: {name: "PersonalityType"},
        TYPE_BASED: {name: "PersonalityType"}
      });
    });

    it("allows misses", () => {
      const component = guessComponent("Tacos");

      expect(component).toBeUndefined();
    });
  });
});
