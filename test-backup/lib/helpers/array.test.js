import {reverse, subtract, times, unique} from "lib/helpers/array";

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

  describe("times", () => {
    it("responds to forEach", () => {
      const fn = jest.fn().mockName("fn").mockImplementation((x) => x + 1);
      times(2).forEach((x) => fn(x));

      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("responds to map", () => {
      const fn = jest.fn().mockName("fn").mockImplementation((x) => x + 1);
      const value = times(2).map((x) => fn(x));

      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(value).toEqual([1, 2]);
    });

    it("returns array", () => {
      const value = times(5);

      expect(value).toEqual([0, 1, 2, 3, 4]);
    });
  });

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
