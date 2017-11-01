export default class I18n{
  constructor(){
    this.locale = "en-us";
    this["en-us"] = {
      best_work_environments: "Best Work Environments",
      complements: "Complements",
      conflicts: "Conflicts",
      extended_description: "Extended Description",
      personality_heading: "Your %{deck_name} Personality is %{personality}",
      potential_benefits: "Potential Benefits",
      potential_pitfalls: "Potential Pitfalls",
      show_less: "Show Less",
      show_more: "Show More",
      me: "Me",
      not_me: "Not Me"
    };
    this["es-us"] = {
      best_work_environments: "Mejores entornos de trabajo",
      complements: "Complementos",
      conflicts: "Conflictos",
      extended_description: "Descripción Extendida",
      personality_heading: "Su Personalidad de %{deck_name} es %{personality}",
      potential_benefits: "Beneficios Potenciales",
      potential_pitfalls: "Peligros Potenciales",
      show_less: "Muestra Menos",
      show_more: "Mostrar Más",
      me: "Yo",
      not_me: "Yo No"
    };
    this["fr-ca"] = {
      best_work_environments: "Meilleurs environnements de travail",
      complements: "Compléments",
      conflicts: "Conflits",
      extended_description: "Description étendue",
      personality_heading: "Votre personnalité de %{deck_name} est %{personality}",
      potential_benefits: "Des bénéfices potentiels",
      potential_pitfalls: "Les pièges potentiels",
      show_less: "Montre Moins",
      show_more: "Montre Plus",
      me: "Moi",
      not_me: "Pas Moi"
    };
    this["no-no"] = {
      best_work_environments: "Beste arbeidsmiljøer",
      complements: "Utfyller",
      conflicts: "Konflikter",
      extended_description: "Utvidet beskrivelse",
      personality_heading: "Din %{deck_name} personlighet er %{personality}",
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
  translate(key, options){
    let result = this[this.locale][key];
    if(!result || !options) { return result; }

    return result.replace(/%\{[a-z_]*\}/g, (r) => options[r.slice(2, -1)]);
  }
  t(key, options){
    return this.translate(key, options);
  }
}
