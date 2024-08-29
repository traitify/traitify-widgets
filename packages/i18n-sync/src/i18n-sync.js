import fs from "node:fs";
import i18nData from "traitify/lib/i18n-data";
import getPath from "./get-path";

const locales = Object.keys(i18nData).reduce((map, key) => ({
  ...map, [key]: {name: i18nData[key].name}
}), {});

const sortKeys = (_key, value) => {
  if(!value) { return value; }
  if(typeof value !== "object") { return value; }
  if(Array.isArray(value)) { return value; }

  return Object.keys(value).sort()
    .reduce((object, key) => ({...object, [key]: value[key]}), {});
};

const stringify = (object) => JSON.stringify(object, sortKeys, 2);

export default class I18nSync {
  static async run(...args) { new I18nSync(...args).run(); }
  constructor({dryRun = false, environment = "production", quiet = false} = {}) {
    this.locales = Object.keys(locales).map((key) => ({code: key, ...locales[key]}));
    this.options = {environment, dryRun, quiet};
    this.translations = this.locales.reduce((map, locale) => (
      {...map, [locale.code]: {...locale, data: []}}
    ), {});
  }
  buildFiles() {
    Object.keys(this.translations).forEach((key) => this.#buildFile(this.translations[key]));
  }
  async importData() {
    const data = await this.#fetchData();

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
  }
  validate() {
    this.validation = this.translations["en-us"];
    this.validation.substitutions = this.validation.data
      .filter((translation) => /%{\w*}/.test(translation.value))
      .map((translation) => ({
        key: translation.key,
        values: translation.value.match(/%\{\w*\}/g)
      }));

    Object.keys(this.translations).forEach((key) => this.#validateLocale(this.translations[key]));
  }
  #addLocale({code, tree}) {
    const locale = this.locales.find(({code: key}) => key.toLowerCase() === code.toLowerCase());
    if(!locale) { return this.#log(`Issue adding locale (${code}: ${stringify(tree)})`); }

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
  #validateLocale(locale) {
    const warnings = {locale: locale.data.length === 0};

    if(!warnings.locale) {
      warnings.keys = this.#validateKeys(locale);
      warnings.substitutions = this.#validateSubstitutions(locale);

      if(warnings.keys.length === 0 && warnings.substitutions.length === 0) { return; }
    }

    if(warnings.locale) {
      this.#log(`Locale Missing: ${locale.code}`);
    }

    if(warnings.keys && warnings.keys.length > 0) {
      this.#log(`Keys Missing for ${locale.code}:`);
      warnings.keys
        .forEach((warning) => this.#log(`  ${warning.key}: ${stringify(warning.value)}`));
    }

    if(warnings.substitutions && warnings.substitutions.length > 0) {
      this.#log(`Substitutions Missing for ${locale.code}:`);
      warnings.substitutions
        .forEach((warning) => this.#log(`  ${warning.key}: ${warning.missing.join(", ")}`));
    }

    this.#log("");
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

    fs.writeFileSync(file, stringify(data));
  }
}
