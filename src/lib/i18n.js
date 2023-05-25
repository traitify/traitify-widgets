import i18nData from "lib/i18n-data";

export default class I18n {
  constructor() {
    this.data = {};
    this.supportedLocales = {};
    this.setDefaultTranslations();
  }
  addTranslations(_locale, {name, data}) {
    const locale = _locale.toLowerCase();
    const currentData = this.data[locale] || {};

    this.data[locale] = {
      ...currentData,
      ...data
    };
    this.supportedLocales[locale] = name;
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
  translate = (locale, key, options) => {
    const keys = key.split(".");

    const traverse = (arr) => {
      let result = this.data[locale.toLowerCase()][arr[0]];

      arr.splice(1).every((current) => {
        if(!result) { return false; }
        result = result[current];

        return true;
      });

      return result;
    };

    const result = keys.length > 1 ? traverse(keys) : this.data[locale.toLowerCase()][key];
    if(!result || !options) { return result; }

    return result.replace(/%\{[a-z_]*\}/g, (r) => options[r.slice(2, -1)]);
  };
}
