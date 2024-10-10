/* eslint-disable no-console */
import I18nSync from "i18n-sync";
import useGlobalMock from "support/hooks/use-global-mock";
import translations from "support/json/translations.json";
import fs from "node:fs";

jest.mock("node:fs");
jest.mock("get-path", () => jest.fn().mockName("getPath").mockImplementation((path) => path));

const stringify = (object) => JSON.stringify(object, null, 2);

describe("I18nSync", () => {
  let i18nSync;
  let response;

  useGlobalMock(console, "log");
  useGlobalMock(global, "fetch");

  beforeEach(() => {
    response = jest.fn().mockName("json").mockReturnValue(translations);

    fetch.mockImplementation(() => Promise.resolve({json: response}));
    i18nSync = new I18nSync();
  });

  describe(".buildFiles", () => {
    it("wrties translations", async() => {
      await i18nSync.importData();
      i18nSync.buildFiles();

      expect(fs.writeFileSync.mock.calls).toMatchSnapshot();
    });
  });

  describe(".importData", () => {
    it("catches errors", async() => {
      const updatedTranslations = {...translations, invalid: {survey: {me: "Oops"}}};
      response.mockReturnValue(updatedTranslations);

      await i18nSync.importData();

      expect(console.log).toHaveBeenCalledWith(
        `Issue adding locale (invalid: ${stringify(updatedTranslations.invalid)})`
      );
      expect(i18nSync.translations).toMatchSnapshot();
    });

    it("saves translations", async() => {
      await i18nSync.importData();

      expect(i18nSync.translations).toMatchSnapshot();
    });
  });

  describe(".validate", () => {
    it("validates missing keys", async() => {
      const code = "es-us";

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(`Keys Missing for ${code}:`);
      expect(console.log).toHaveBeenCalledWith(`  look.at.this: "I'm missing\\n\\n from es-US"`);
    });

    it("validates missing locales", async() => {
      const code = "en-gb";

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(`Locale Missing: ${code}`);
    });

    it("validates missing substitutions", async() => {
      const code = "es-pr";

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(`Substitutions Missing for ${code}:`);
      expect(console.log).toHaveBeenCalledWith("  sub.with_1: %{name}");
    });
  });
});
