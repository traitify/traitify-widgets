import {rgba} from "lib/helpers/color";

describe("Helpers", () => {
  describe("rgba", () => {
    it("returns rgba color", () => {
      const result = rgba("#42B755", 50);

      expect(result).toBe("rgba(66,183,85,0.5)");
    });
  });
});
