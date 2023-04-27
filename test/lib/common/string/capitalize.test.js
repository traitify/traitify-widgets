import capitalize from "lib/common/string/capitalize";

describe("String", () => {
  describe("capitalize", () => {
    it("capitalizes", () => {
      const value = capitalize("not me");

      expect(value).toBe("Not me");
    });
  });
});
