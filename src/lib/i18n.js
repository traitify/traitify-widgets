export default class I18n {
  constructor() {
    this.locale = "en-us";
    this["en-us"] = {
      potential_benefits: "Potential Benefits",
      potential_pitfalls: "Potential Pitfalls",
      show_less: "Show Less",
      show_more: "Show More"
    }
    return this;
  }
  setLocale(locale) {
    this.locale = locale;
  }
  translate(key) {
    return this[this.locale][key];
  }
}
