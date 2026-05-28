import findMap from "lib/common/array/find-map";

describe("Array", () => {
  describe("findMap", () => {
    it("returns first mapped truthy value", () => {
      const value = findMap([1, 2, 3], (item) => item > 1 && item * 10);

      expect(value).toBe(20);
    });

    it("returns undefined when nothing matches", () => {
      const value = findMap([1, 2, 3], () => null);

      expect(value).toBeUndefined();
    });

    it("returns undefined for empty array", () => {
      const value = findMap([], () => "anything");

      expect(value).toBeUndefined();
    });

    it("passes item and index to callback", () => {
      const callback = jest.fn();
      findMap(["a", "b"], callback);

      expect(callback).toHaveBeenCalledWith("a", 0);
      expect(callback).toHaveBeenCalledWith("b", 1);
    });

    it("short-circuits after first truthy result", () => {
      const callback = jest.fn((item) => item === "b" && item.toUpperCase());
      findMap(["a", "b", "c"], callback);

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
