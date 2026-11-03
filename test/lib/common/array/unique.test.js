import unique from "lib/common/array/unique";

describe("Array", () => {
  describe("unique", () => {
    it("removes duplicates", () => {
      const value = unique(["hey", "you", "hey", "guys"]);

      expect(value).toEqual(["hey", "you", "guys"]);
    });

    it("returns new array", () => {
      const array = ["hey", "you"];
      const value = unique(array);

      expect(value).not.toBe(array);
    });
  });
});
