import {unique} from "lib/helpers/array";

describe("Helpers", () => {
  describe("Array", () => {
    describe("unique", () => {
      it("removes duplicates", () => {
        const value = unique(["hey", "hey", "you", "you"]);

        expect(value).toEqual(["hey", "you"]);
      });

      it("returns new array", () => {
        const array = ["hey", "jude"];
        const value = unique(array);

        expect(value).not.toBe(array);
      });
    });
  });
});
