import {combine, createColumns, findCompetency} from "lib/common/combine-data";
import mutable from "lib/common/object/mutable";
import assessment from "support/data/assessment/personality/completed";
import {data as _benchmark} from "support/data/benchmark";
import _guide from "support/data/guide.json";

describe("combineData", () => {
  let benchmark;
  let guide;
  let types;

  beforeEach(() => {
    benchmark = mutable(_benchmark);
    guide = mutable(_guide);
    types = mutable(assessment.personality_types);
  });

  describe("combine", () => {
    it("falls back to default benchmark data", () => {
      const value = combine({guide, types});

      expect(value).toMatchSnapshot();
    });

    it("sorts by rank", () => {
      const value = combine({benchmark, guide, types});

      expect(value).toMatchSnapshot();
    });

    it("sorts by type", () => {
      const value = combine({benchmark, guide, order: "types", types});

      expect(value).toMatchSnapshot();
    });
  });

  describe("createColumns", () => {
    it("falls back to default benchmark data", () => {
      const value = createColumns({guide, types});

      expect(value).toMatchSnapshot();
    });

    it("sorts by rank", () => {
      const value = createColumns({benchmark, guide, types});

      expect(value).toMatchSnapshot();
    });

    it("sorts by type", () => {
      const value = createColumns({benchmark, guide, order: "types", types});

      expect(value).toMatchSnapshot();
    });
  });

  describe("findCompetency", () => {
    it("returns competency", () => {
      const typeID = types[0].personality_type.id;
      const value = findCompetency({guide, typeID});

      expect(value.questionSequences[0].personalityTypeId).toEqual(typeID);
    });

    it("returns nothing", () => {
      const value = findCompetency({guide, typeID: "nope"});

      expect(value).toBeUndefined();
    });

    it("returns nothing without guide", () => {
      const typeID = types[0].personality_type.id;
      const value = findCompetency({guide: null, typeID});

      expect(value).toBeUndefined();
    });
  });
});
