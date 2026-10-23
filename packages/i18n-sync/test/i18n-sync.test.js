/* eslint-disable no-console */
import I18nSync from "i18n-sync";
import useGlobalMock from "support/hooks/use-global-mock";
import translations from "support/data/translations.json";
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
  });

  describe(".buildFiles", () => {
    beforeEach(() => {
      i18nSync = new I18nSync();
    });

    it("wrties translations", async() => {
      await i18nSync.importData();
      i18nSync.buildFiles();

      expect(fs.writeFileSync.mock.calls).toMatchSnapshot();
    });

    it("writes arrays and empty values", async() => {
      response.mockReturnValue({...translations, "de-de": {list: ["a", "b"], empty: ""}});

      await i18nSync.importData();
      i18nSync.buildFiles();

      const call = fs.writeFileSync.mock.calls.find(([path]) => path.includes("de-de"));
      expect(call[1]).toContain("\"list\"");
    });
  });

  describe(".importData", () => {
    beforeEach(() => {
      i18nSync = new I18nSync();
    });

    it("catches errors", async() => {
      const updatedTranslations = {...translations, invalid: {survey: {me: "Oops"}}};
      response.mockReturnValue(updatedTranslations);

      await i18nSync.importData();

      expect(i18nSync.unknownLocales).toEqual([{code: "invalid", tree: {survey: {me: "Oops"}}}]);
      expect(i18nSync.translations).toMatchSnapshot();
    });

    it("saves translations", async() => {
      await i18nSync.importData();

      expect(i18nSync.translations).toMatchSnapshot();
    });

    it("normalizes non-string values", async() => {
      response.mockReturnValue({...translations, "de-de": {count: 5}});

      await i18nSync.importData();

      const record = i18nSync.translations["de-de"].data.find((t) => t.key === "count");
      expect(record.value).toBe(5);
    });
  });

  describe(".run", () => {
    it("runs from the static helper", async() => {
      const run = jest.spyOn(I18nSync.prototype, "run").mockResolvedValue();

      await I18nSync.run({quiet: true});

      expect(run).toHaveBeenCalled();
      run.mockRestore();
    });

    it("skips output when quiet", async() => {
      await new I18nSync({quiet: true}).run();

      expect(console.log).not.toHaveBeenCalled();
    });

    it("skips writing on a dry run", async() => {
      fs.writeFileSync.mockClear();

      await new I18nSync({dryRun: true}).run();

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe(".validate", () => {
    it("summarizes issue counts by default", async() => {
      i18nSync = new I18nSync();
      await i18nSync.run();

      expect(console.log)
        .toHaveBeenCalledWith(expect.stringMatching(/^Issues found in \d+ locale/));
      expect(console.log).toHaveBeenCalledWith("  en-gb: locale missing");
      expect(console.log).toHaveBeenCalledWith("  es-us: 2 keys missing, 1 substitution missing");
      expect(console.log).toHaveBeenCalledWith("  es-pr: 5 keys missing, 1 substitution missing");
      expect(console.log).toHaveBeenCalledWith("Run with --verbose to see details");
    });

    it("validates a single missing key", async() => {
      const updatedTranslations = {
        ...translations,
        "de-de": {
          look: {at: {this: "da"}},
          status: {interview: {text: "eins"}},
          sub: {with_1: "%{name} eins", with_2: "%{name} %{something} zwei"},
          survey: {me: "Ich"}
        }
      };
      response.mockReturnValue(updatedTranslations);
      i18nSync = new I18nSync();

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith("  de-de: 1 key missing");
    });

    it("validates no missing translations", async() => {
      let CompleteSync;
      jest.isolateModules(() => {
        jest.doMock("traitify/lib/i18n-data", () => ({"en-us": {name: "English (US)"}}));
        CompleteSync = require("i18n-sync").default;
      });
      response.mockReturnValue({"en-us": translations["en-us"]});

      await new CompleteSync().run();

      expect(console.log).toHaveBeenCalledWith("No issues found");
    });

    it("groups unknown locales into the summary", async() => {
      const updatedTranslations = {...translations, invalid: {survey: {me: "Oops"}}};
      response.mockReturnValue(updatedTranslations);
      i18nSync = new I18nSync();

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith("  invalid: unknown locale");
    });

    it("lists unknown locale details when verbose", async() => {
      const updatedTranslations = {...translations, invalid: {survey: {me: "Oops"}}};
      response.mockReturnValue(updatedTranslations);
      i18nSync = new I18nSync({verbose: true});

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(
        `Issue adding locale (invalid: ${stringify(updatedTranslations.invalid)})`
      );
    });

    it("validates missing keys", async() => {
      const code = "es-us";
      i18nSync = new I18nSync({verbose: true});

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(`Keys Missing for ${code}:`);
      expect(console.log).toHaveBeenCalledWith(`  look.at.this: "I'm missing\\n\\n from es-US"`);
    });

    it("validates missing locales", async() => {
      const code = "en-gb";
      i18nSync = new I18nSync({verbose: true});

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(`Locale Missing: ${code}`);
    });

    it("validates missing substitutions", async() => {
      const code = "es-pr";
      i18nSync = new I18nSync({verbose: true});

      await i18nSync.run();

      expect(console.log).toHaveBeenCalledWith(`Substitutions Missing for ${code}:`);
      expect(console.log).toHaveBeenCalledWith("  sub.with_1: %{name}");
    });
  });
});
