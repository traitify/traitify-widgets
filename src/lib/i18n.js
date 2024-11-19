import dig from "./common/object/dig";
import merge from "./common/object/merge";
import i18nData from "./i18n-data";

export default class I18n {
  constructor() {
    this.data = {};
    this.supportedLocales = {};
    this.setDefaultTranslations();
  }
  addTranslations(_locale, {name, data}) {
    const locale = _locale.toLowerCase();
    const currentData = this.data[locale] || {};

    this.data[locale] = merge(currentData, data);
    if(name) { this.supportedLocales[locale] = name; }
  }
  copyTranslations(_originLocale, _targetLocale) {
    const originLocale = _originLocale.toLowerCase();
    const targetLocale = _targetLocale.toLowerCase();
    const targetData = this.data[targetLocale] || {};
    const originData = this.data[originLocale] || {};

    this.data[targetLocale] = {
      ...targetData,
      ...originData
    };
  }
  setDefaultTranslations() {
    Object.keys(i18nData).forEach((locale) => {
      this.addTranslations(locale, i18nData[locale]);
    });
  }
  translate = (locale, _key, options) => {
    const keys = _key.split(".");
    let result = dig(this.data, locale.toLowerCase(), ...keys);
    if(!result && locale.toLowerCase() !== "en-us") { result = dig(this.data, "en-us", ...keys); }
    if(!result || !options) { return result; }

    return result.replace(/%\{[a-z_]*\}/g, (r) => options[r.slice(2, -1)]);
  };
}
