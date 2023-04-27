import reverse from "lib/common/array/reverse";

describe("Array", () => {
  describe("reverse", () => {
    it("returns new array", () => {
      const array = ["hey", "jude"];
      const value = reverse(array);

      expect(array[0]).toEqual("hey");
      expect(value).not.toBe(array);
    });

    it("returns new array when 1 element", () => {
      const array = ["hey"];
      const value = reverse(array);

      expect(value).not.toBe(array);
    });

    it("reverses", () => {
      const value = reverse(["hey", "hey", "you", "you"]);

      expect(value).toEqual(["you", "you", "hey", "hey"]);
    });
  });
});
