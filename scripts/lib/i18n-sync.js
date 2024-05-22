/* eslint-disable no-console */
import fs from "node:fs";
import i18nData from "lib/i18n-data";

const locales = Object.keys(i18nData).reduce((map, key) => ({
  ...map, [key]: {name: i18nData[key].name}
}), {});

const sortKeys = (key, value) => {
  if(!value) { return value; }
  if(typeof value !== "object") { return value; }
  if(Array.isArray(value)) { return value; }

  return Object.keys(value).sort()
    .reduce((object, key) => (object[key] = value[key], object), {});
};

const stringify = (object) => JSON.stringify(object, sortKeys, 2);

export default class I18nSync {
  static async run() { new I18nSync().run(); }
  constructor() {
    this.locales = Object.keys(locales).map((key) => ({code: key, ...locales[key]}));
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
    if(!locale) { return console.log(`Issue adding locale (${code}: ${stringify(tree)})`); }

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

    this.#writeFile(`./src/lib/i18n-data/${locale.code}.json`, locale.tree);
  }
  // TODO: Get locales from CDN
  #fetchData() {
    const headers = {Accept: "application/json"};
    const options = {headers, method: "GET"};
    const url = "https://cdn-stag.traitify.com/translations/widgets.json";

    return fetch(url, options).then((response) => response.json());
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
      console.log(`Locale Missing: ${locale.code}`);
    }

    if(warnings.keys && warnings.keys.length > 0) {
      console.log(`Keys Missing for ${locale.code}:`);
      warnings.keys
        .forEach((warning) => console.log(`  ${warning.key}: ${stringify(warning.value)}`));
    }

    if(warnings.substitutions && warnings.substitutions.length > 0) {
      console.log(`Substitutions Missing for ${locale.code}:`);
      warnings.substitutions
        .forEach((warning) => console.log(`  ${warning.key}: ${warning.missing.join(", ")}`));
    }

    console.log("");
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
    fs.writeFileSync(file, stringify(data));
  }
}
