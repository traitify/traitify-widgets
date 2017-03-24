export default class I18n {
  constructor() {
    this.locale = "en-us";
    this["en-us"] = {
      potential_benefits: "Potential Benefits",
      potential_pitfalls: "Potential Pitfalls",
      show_less: "Show Less",
      show_more: "Show More",
      me: "Me",
      not_me: "Not Me"
    };
    
    this["es-us"] = {
      potential_benefits: "Beneficios Potenciales",
      potential_pitfalls: "Peligros Potenciales",
      show_less: "Muestra Menos",
      show_more: "Mostrar Más",
      me: "Yo",
      not_me: "Yo No"
    };

    this["fr-ca"] = {
      potential_benefits: "Des bénéfices potentiels",
      potential_pitfalls: "Les pièges potentiels",
      show_less: "Montre Moins",
      show_more: "Montre Plus",
      me: "Moi",
      not_me: "Pas Moi"
    };

    this["fr-us"] = Object.assign({}, this["fr-ca"]); // copy canadian french to us french

    return this;
  }
  setLocale(locale) {
    this.locale = locale;
  }
  translate(key) {
    return this[this.locale][key];
  }
  t(key){
    return this.translate(key);
  }
}
