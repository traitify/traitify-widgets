import mutable from "lib/common/object/mutable";
import themeAssessment from "lib/common/theme-assessment";
import otherAssessment from "support/json/assessment/dimension-based.json";
import assessment from "support/json/assessment/type-based.json";

describe("themeAssessment", () => {
  let data;

  beforeEach(() => {
    data = mutable(assessment);
  });

  describe("blend", () => {
    it("doesn't error with wrong personality ID", () => {
      data.personality_blend.personality_type_1.id = "abc";
      const value = themeAssessment(data);

      expect(value.personality_blend).toMatchSnapshot();
    });

    it("doesn't require details", () => {
      data.personality_blend.details = null;
      const value = themeAssessment(data);

      expect(value.personality_blend).toMatchSnapshot();
    });

    it("isn't required", () => {
      data.personality_blend = null;
      const value = themeAssessment(data);

      expect(value.personality_blend).toMatchSnapshot();
    });

    it("updates", () => {
      const value = themeAssessment(data);

      expect(value.personality_blend).toMatchSnapshot();
    });
  });

  describe("traits", () => {
    it("updates", () => {
      const value = themeAssessment(data);

      expect(value.personality_traits[0]).toMatchSnapshot();
    });
  });

  describe("types", () => {
    it("doesn't error with wrong personality ID", () => {
      data.personality_types[0].personality_type.id = "abc";
      const value = themeAssessment(data);

      expect(value.personality_types[0]).toMatchSnapshot();
    });

    it("doesn't require details", () => {
      data.personality_types[0].personality_type.details = null;
      const value = themeAssessment(data);

      expect(value.personality_types[0]).toMatchSnapshot();
    });

    it("isn't required", () => {
      data.personality_types[0].personality_type = null;
      const value = themeAssessment(data);

      expect(value.personality_types[0]).toMatchSnapshot();
    });

    it("updates", () => {
      const value = themeAssessment(data);

      expect(value.personality_types[0]).toMatchSnapshot();
    });
  });

  it("requires career assessment", () => {
    data = mutable(otherAssessment);
    const value = themeAssessment(data);

    expect(value).toBe(data);
  });

  it("requires completed assessment", () => {
    data.personality_types = null;
    const value = themeAssessment(data);

    expect(value).toBe(data);
  });
});
