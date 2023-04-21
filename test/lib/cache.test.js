/** @jest-environment jsdom */
import Cache from "lib/cache";

describe("Cache", () => {
  let cache;
  let clear;
  let getItem;
  let removeItem;
  let setItem;

  beforeEach(() => {
    sessionStorage.setItem("bestPet", JSON.stringify({value: "cats"}));
    sessionStorage.setItem("superman", JSON.stringify({value: "clark"}));

    clear = jest.spyOn(Object.getPrototypeOf(sessionStorage), "clear");
    getItem = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    removeItem = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    setItem = jest.spyOn(Object.getPrototypeOf(sessionStorage), "setItem");
    cache = new Cache();
  });

  describe("clear", () => {
    it("removes everything", () => {
      cache.clear();

      expect(clear).toHaveBeenCalled();
    });
  });

  describe("get", () => {
    it("returns value without data", () => {
      const value = cache.get("blank");

      expect(getItem).toHaveBeenCalled();
      expect(value).toBe(null);
    });

    it("returns value without expiration", () => {
      const value = cache.get("superman");

      expect(getItem).toHaveBeenCalled();
      expect(value).toBe("clark");
    });

    it("returns value with expiration", () => {
      sessionStorage.setItem("superman", JSON.stringify({expiresAt: Date.now() + 1000, value: "clark"}));
      const value = cache.get("superman");

      expect(getItem).toHaveBeenCalled();
      expect(value).toBe("clark");
    });

    it("removes expired value", () => {
      sessionStorage.setItem("superman", JSON.stringify({expiresAt: Date.now() - 1000, value: "clark"}));
      const value = cache.get("superman");

      expect(getItem).toHaveBeenCalled();
      expect(removeItem).toHaveBeenCalled();
      expect(sessionStorage.getItem("superman")).toBeNull();
      expect(value).toBeNull();
    });
  });

  describe("remove", () => {
    it("removes key", () => {
      cache.remove("superman");

      expect(removeItem).toHaveBeenCalled();
      expect(sessionStorage.getItem("superman")).toBeNull();
      expect(JSON.parse(sessionStorage.getItem("bestPet"))).toEqual(expect.objectContaining({value: "cats"}));
    });

    it("removes key without data", () => {
      cache.remove("blank");

      expect(removeItem).toHaveBeenCalled();
      expect(sessionStorage.getItem("blank")).toBeNull();
      expect(JSON.parse(sessionStorage.getItem("bestPet"))).toEqual(expect.objectContaining({value: "cats"}));
    });
  });

  describe("set", () => {
    it("sets key", () => {
      cache.set("super", "man");

      expect(setItem).toHaveBeenCalled();
      expect(JSON.parse(sessionStorage.getItem("super"))).toEqual(
        expect.objectContaining({value: "man"})
      );
    });

    it("sets expiration", () => {
      const expiresAt = Date.now() + 1000;
      cache.set("super", "man", {expiresAt});

      expect(setItem).toHaveBeenCalled();
      expect(JSON.parse(sessionStorage.getItem("super"))).toEqual(
        expect.objectContaining({expiresAt, value: "man"})
      );
    });

    it("sets expiration from seconds", () => {
      const expiresIn = 60 * 24;
      cache.set("super", "man", {expiresIn});

      expect(setItem).toHaveBeenCalled();
      expect(JSON.parse(sessionStorage.getItem("super"))).toEqual(
        expect.objectContaining({expiresAt: expiresIn * 1000 + Date.now(), value: "man"})
      );
    });
  });
});
