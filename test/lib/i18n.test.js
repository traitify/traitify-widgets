import I18n from "lib/i18n";

describe("I18n", () => {
  let i18n;

  beforeEach(() => {
    i18n = new I18n();
  });

  describe("constructor", () => {
    it("has default locale", () => {
      expect(i18n.locale).toBe("en-us");
    });

    it("creates default translations", () => {
      expect(i18n.data).toBeDefined();
      expect(i18n.data["en-us"]).toBeDefined();
      expect(i18n.data["es-us"]).toBeDefined();
      expect(i18n.data["fr-ca"]).toBeDefined();
      expect(i18n.data["fr-us"]).toBeDefined();
      expect(i18n.data["ht-us"]).toBeDefined();
      expect(i18n.data["no-no"]).toBeDefined();
    });
  });

  describe("addTranslations", () => {
    it("adds data to new locale", () => {
      i18n.addTranslations("es-CU", {tacos: "Yo quiero tacos"});

      expect(i18n.data["es-cu"].tacos).toBe("Yo quiero tacos");
    });

    it("adds data to existing locale", () => {
      i18n.addTranslations("es-US", {tacos: "Yo quiero tacos"});

      expect(i18n.data["es-us"].me).toBe("Yo");
      expect(i18n.data["es-us"].tacos).toBe("Yo quiero tacos");
    });

    it("merges data to existing locale", () => {
      i18n.addTranslations("es-US", {
        me: "Yo quiero",
        tacos: "Yo quiero tacos"
      });

      expect(i18n.data["es-us"].me).toBe("Yo quiero");
      expect(i18n.data["es-us"].tacos).toBe("Yo quiero tacos");
    });
  });

  describe("copyTranslations", () => {
    it("copies data to new locale", () => {
      i18n.copyTranslations("es-US", "es-CU");

      expect(i18n.data["es-cu"].me).toBe("Yo");
    });

    it("copies data to existing locale", () => {
      i18n.copyTranslations("en-US", "es-US");

      expect(i18n.data["es-us"].me).toBe("Me");
    });

    it("copies data from new locale", () => {
      i18n.copyTranslations("en-CU", "es-CU");

      expect(i18n.data["es-cu"]).toEqual({});
    });

    it("only overwrites confilicts", () => {
      i18n.data["es-us"].tacos = "Yo quiero tacos";
      i18n.copyTranslations("en-US", "es-US");

      expect(i18n.data["es-us"].me).toBe("Me");
      expect(i18n.data["es-us"].tacos).toBe("Yo quiero tacos");
    });
  });

  describe("setLocale", () => {
    it("updates locale", () => {
      i18n.setLocale("en-US");

      expect(i18n.locale).toBe("en-us");
    });

    it("requires locale data", () => {
      i18n.setLocale("en-ru");

      expect(i18n.locale).toBe("en-us");
    });
  });

  describe("translate", () => {
    it("returns translation", () => {
      const translation = i18n.translate("me");

      expect(translation).toBe("Me");
    });

    it("substitutes options", () => {
      i18n.data["en-us"].love = "I love %{noun}";
      const translation = i18n.translate("love", {noun: "tacos"});

      expect(translation).toBe("I love tacos");
    });

    it("allows misses", () => {
      const translation = i18n.translate("tacos");

      expect(translation).toBeUndefined();
    });
  });
});
