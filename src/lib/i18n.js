import i18nData from "lib/i18n-data";

export default class I18n {
  constructor() {
    this.data = {};
    this.setDefaultTranslations();
  }
  addTranslations(_locale, data) {
    const locale = _locale.toLowerCase();
    const currentData = this.data[locale] || {};

    this.data[locale] = {
      ...currentData,
      ...data
    };
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
    const result = this.data[locale][key];
    if(!result || !options) { return result; }

    return result.replace(/%\{[a-z_]*\}/g, (r) => options[r.slice(2, -1)]);
  };
}
