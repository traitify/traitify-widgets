import subtract from "lib/common/array/subtract";

describe("Array", () => {
  describe("subtract", () => {
    it("removes items", () => {
      const value = subtract(["hey", "you"], ["you", "guys"]);

      expect(value).toEqual(["hey"]);
    });

    it("removes items any number of times", () => {
      const value = subtract(["hey", "hey", "you", "you"], ["you", "guys"]);

      expect(value).toEqual(["hey", "hey"]);
    });

    it("returns new array", () => {
      const array1 = ["hey", "you"];
      const array2 = ["you", "guys"];
      const value = subtract(array1, array2);

      expect(value).not.toBe(array1);
    });
  });
});
