import findMap from "./common/array/find-map";
import dig from "./common/object/dig";
import merge from "./common/object/merge";
import {isArray} from "./common/object/type";
import i18nData from "./i18n-data";

export default class I18n {
  constructor() {
    this.data = {};
    this.supportedLocales = {};
    this.setDefaultTranslations();
  }
  setDefaultTranslations() {
    Object.keys(i18nData).forEach((locale) => {
      this.addTranslations(locale, i18nData[locale]);
    });
  }
  addTranslations = (_locale, {name, data}) => {
    const locale = _locale.toLowerCase();
    const currentData = this.data[locale] || {};

    this.data[locale] = merge(currentData, data);
    if(name) { this.supportedLocales[locale] = name; }
  };
  copyTranslations = (_originLocale, _targetLocale) => {
    const originLocale = _originLocale.toLowerCase();
    const targetLocale = _targetLocale.toLowerCase();
    const targetData = this.data[targetLocale] || {};
    const originData = this.data[originLocale] || {};

    this.data[targetLocale] = {
      ...targetData,
      ...originData
    };
  };
  // NOTE: Returns first translation if key is an array
  translate = (locale, _key, options) => {
    const keys = isArray(_key) ? _key : [_key];
    let result = findMap(keys, (key) => dig(this.data, locale.toLowerCase(), ...key.split(".")));

    if(!result && locale.toLowerCase() !== "en-us") {
      result = findMap(keys, (key) => dig(this.data, "en-us", ...key.split(".")));
    }
    if(!result || !options) { return result; }

    return result.replace(/%\{[a-z_]*\}/g, (r) => options[r.slice(2, -1)]);
  };
}
