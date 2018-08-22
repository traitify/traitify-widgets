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
});
