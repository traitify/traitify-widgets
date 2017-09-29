export default class I18n{
  constructor(){
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
    this["no-no"] = {
      potential_benefits: "Potensielle fordeler",
      potential_pitfalls: "Potensielle fallgruver",
      show_less: "Vis mindre",
      show_more: "Vis mer",
      me: "Meg",
      not_me: "Ikke meg"
    };

    this["fr-us"] = this["fr-ca"];

    return this;
  }
  setLocale(locale){
    this.locale = locale.toLowerCase();
  }
  translate(key){
    return this[this.locale][key];
  }
  t(key){
    return this.translate(key);
  }
}
