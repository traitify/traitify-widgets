import {mutable} from "lib/helpers/object";
import themeAssessment from "lib/helpers/theme-assessment";
import otherAssessment from "support/json/assessment/dimension-based.json";
import assessment from "support/json/assessment/type-based.json";

describe("Helpers", () => {
  describe("themeAssessment", () => {
    let options;

    beforeEach(() => {
      options = {data: mutable(assessment), theme: "paradox"};
    });

    describe("blend", () => {
      it("doesn't error with wrong personality ID", () => {
        options.data.personality_blend.personality_type_1.id = "abc";
        const value = themeAssessment(options);

        expect(value.personality_blend).toMatchSnapshot();
      });

      it("doesn't require details", () => {
        options.data.personality_blend.details = null;
        const value = themeAssessment(options);

        expect(value.personality_blend).toMatchSnapshot();
      });

      it("isn't required", () => {
        options.data.personality_blend = null;
        const value = themeAssessment(options);

        expect(value.personality_blend).toMatchSnapshot();
      });

      it("updates", () => {
        const value = themeAssessment(options);

        expect(value.personality_blend).toMatchSnapshot();
      });
    });

    describe("traits", () => {
      it("updates", () => {
        const value = themeAssessment(options);

        expect(value.personality_traits[0]).toMatchSnapshot();
      });
    });

    describe("types", () => {
      it("doesn't error with wrong personality ID", () => {
        options.data.personality_types[0].personality_type.id = "abc";
        const value = themeAssessment(options);

        expect(value.personality_types[0]).toMatchSnapshot();
      });

      it("doesn't require details", () => {
        options.data.personality_types[0].personality_type.details = null;
        const value = themeAssessment(options);

        expect(value.personality_types[0]).toMatchSnapshot();
      });

      it("isn't required", () => {
        options.data.personality_types[0].personality_type = null;
        const value = themeAssessment(options);

        expect(value.personality_types[0]).toMatchSnapshot();
      });

      it("updates", () => {
        const value = themeAssessment(options);

        expect(value.personality_types[0]).toMatchSnapshot();
      });
    });

    it("requires career assessment", () => {
      options.data = mutable(otherAssessment);
      const value = themeAssessment(options);

      expect(value).toBe(options.data);
    });

    it("requires completed assessment", () => {
      options.data.personality_types = null;
      const value = themeAssessment(options);

      expect(value).toBe(options.data);
    });

    it("requires paradox theme", () => {
      options.theme = "default";
      const value = themeAssessment(options);

      expect(value).toBe(options.data);
    });
  });
});
