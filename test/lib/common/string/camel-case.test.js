import camelCase from "lib/common/string/camel-case";

describe("String", () => {
  describe("camelCase", () => {
    it("replaces hyphens", () => {
      const value = camelCase("really-not-me");

      expect(value).toBe("reallyNotMe");
    });

    it("replaces underscores", () => {
      const value = camelCase("REALLY_NOT_ME");

      expect(value).toBe("reallyNotMe");
    });
  });
});
