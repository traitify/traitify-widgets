import fs from "node:fs";
import i18nData from "traitify/lib/i18n-data";
import {isArray, isObject, isString} from "traitify/lib/common/object/type";
import getPath from "./get-path";

const locales = Object.keys(i18nData).reduce((map, key) => ({
  ...map, [key]: {name: i18nData[key].name}
}), {});

const normalize = (value) => {
  if(isString(value)) { return value.replace(/\\n/g, "\n"); }
  if(isArray(value)) { return value.map(normalize); }
  if(isObject(value)) {
    return Object.keys(value).reduce((acc, key) => ({...acc, [key]: normalize(value[key])}), {});
  }

  return value;
};

const sortKeys = (_key, value) => {
  if(!value) { return value; }
  if(typeof value !== "object") { return value; }
  if(Array.isArray(value)) { return value; }

  return Object.keys(value).sort()
    .reduce((object, key) => ({...object, [key]: value[key]}), {});
};

const stringify = (object) => JSON.stringify(object, sortKeys, 2);

const pluralize = (word, count) => `${count} ${word}${count === 1 ? "" : "s"}`;

export default class I18nSync {
  static async run(...args) { new I18nSync(...args).run(); }
  constructor({dryRun = false, environment = "production", quiet = false, verbose = false} = {}) {
    this.locales = Object.keys(locales).map((key) => ({code: key, ...locales[key]}));
    this.options = {environment, dryRun, quiet, verbose};
    this.unknownLocales = [];
    this.translations = this.locales.reduce((map, locale) => (
      {...map, [locale.code]: {...locale, data: []}}
    ), {});
  }
  buildFiles() {
    Object.keys(this.translations).forEach((key) => this.#buildFile(this.translations[key]));
  }
  async importData() {
    const rawData = await this.#fetchData();
    const data = normalize(rawData);

    Object.keys(data).forEach((key) => this.#addLocale({code: key, tree: data[key]}));
  }
  async run() {
    await this.importData();
    this.buildFiles();
    this.validate();
    this.help();
  }
  help() {
    this.#log("Available Options:");
    this.#log("  --dev to run against staging");
    this.#log("  --dryRun to run without updating files");
    this.#log("  --quiet to run without output");
    this.#log("  --verbose to list every missing key and substitution");
  }
  validate() {
    this.validation = this.translations["en-us"];
    this.validation.substitutions = this.validation.data
      .filter((translation) => /%{\w*}/.test(translation.value))
      .map((translation) => ({
        key: translation.key,
        values: translation.value.match(/%\{\w*\}/g)
      }));

    const warnings = Object.keys(this.translations)
      .map((key) => this.#validateLocale(this.translations[key]))
      .filter(Boolean);

    if(this.options.verbose) {
      this.unknownLocales.forEach((unknown) => this.#logUnknownLocale(unknown));
      warnings.forEach((warning) => this.#logLocale(warning));
    } else {
      this.#logSummary(warnings);
    }
  }
  #addLocale({code, tree}) {
    const locale = this.locales.find(({code: key}) => key.toLowerCase() === code.toLowerCase());
    if(!locale) { return this.unknownLocales.push({code, tree}); }

    this.translations[locale.code].tree = tree;
    Object.keys(tree).forEach((key) => this.#addTranslation({key, locale, value: tree[key]}));
  }
  #addTranslation({key, locale, value}) {
    const translation = {key, locale: locale.code, value};

    if(typeof value === "object") {
      return Object.keys(value).forEach((nestedKey) => (
        this.#addTranslation({key: [key, nestedKey].join("."), locale, value: value[nestedKey]})
      ));
    }

    this.translations[locale.code].data.push(translation);
  }
  #buildFile(locale) {
    if(!locale.tree) { return; }

    const path = getPath(`src/lib/i18n-data/${locale.code}.json`);
    this.#writeFile(path, locale.tree);
  }
  #fetchData() {
    const headers = {Accept: "application/json"};
    const options = {headers, method: "GET"};
    const url = {
      production: "https://cdn.traitify.com/translations/widgets.json",
      staging: "https://cdn-stag.traitify.com/translations/widgets.json"
    }[this.options.environment];

    return fetch(url, options).then((response) => response.json());
  }
  #log(...options) {
    if(this.options.quiet) { return; }

    console.log(...options); // eslint-disable-line no-console
  }
  #validateKeys(locale) {
    const warnings = [];

    this.validation.data.forEach((record) => {
      if(locale.data.find((t) => t.key === record.key)) { return; }

      warnings.push({key: record.key, value: record.value});
    });

    return warnings;
  }
  #logUnknownLocale({code, tree}) {
    this.#log(`Issue adding locale (${code}: ${stringify(tree)})`);
  }
  #logLocale(warnings) {
    if(warnings.locale) {
      this.#log(`Locale Missing: ${warnings.code}`);
    }

    if(warnings.keys && warnings.keys.length > 0) {
      this.#log(`Keys Missing for ${warnings.code}:`);
      warnings.keys
        .forEach((warning) => this.#log(`  ${warning.key}: ${stringify(warning.value)}`));
    }

    if(warnings.substitutions && warnings.substitutions.length > 0) {
      this.#log(`Substitutions Missing for ${warnings.code}:`);
      warnings.substitutions
        .forEach((warning) => this.#log(`  ${warning.key}: ${warning.missing.join(", ")}`));
    }

    this.#log("");
  }
  #logSummary(warnings) {
    const total = warnings.length + this.unknownLocales.length;
    if(total === 0) { return this.#log("No issues found"); }

    this.#log(`Issues found in ${pluralize("locale", total)}:`);
    this.unknownLocales.forEach(({code}) => this.#log(`  ${code}: unknown locale`));
    warnings.forEach((warning) => {
      if(warning.locale) { return this.#log(`  ${warning.code}: locale missing`); }

      const counts = [
        [warning.keys.length, "key"],
        [warning.substitutions.length, "substitution"]
      ]
        .filter(([count]) => count > 0)
        .map(([count, word]) => `${pluralize(word, count)} missing`);

      this.#log(`  ${warning.code}: ${counts.join(", ")}`);
    });

    this.#log("Run with --verbose to see details");
  }
  #validateLocale(locale) {
    const warnings = {code: locale.code, locale: locale.data.length === 0};

    if(warnings.locale) { return warnings; }

    warnings.keys = this.#validateKeys(locale);
    warnings.substitutions = this.#validateSubstitutions(locale);

    if(warnings.keys.length === 0 && warnings.substitutions.length === 0) { return null; }

    return warnings;
  }
  #validateSubstitutions(locale) {
    const warnings = [];

    this.validation.substitutions.forEach((record) => {
      const translation = locale.data.find((t) => t.key === record.key);
      if(!translation) { return; }

      const matches = translation.value.match(/%\{\w*\}/g) || [];
      const missing = record.values.filter((value) => !matches.includes(value));
      if(missing.length === 0) { return; }

      warnings.push({key: record.key, missing});
    });

    return warnings;
  }
  #writeFile(file, data) {
    if(this.options.dryRun) { return; }

    fs.writeFileSync(file, `${stringify(data)}\n`);
  }
}
