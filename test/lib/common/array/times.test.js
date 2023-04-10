import times from "lib/common/array/times";

describe("Array", () => {
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
});
