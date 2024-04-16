const fs = require("node:fs");
const locales = {
  "de-de": {name: "German"},
  "en-gb": {name: "English (GB)"},
  "en-us": {name: "English (US)"},
  "es-ec": {name: "Spanish (Ecuador)"},
  "es-pr": {name: "Spanish (Puerto Rico)"},
  "es-us": {name: "Spanish"},
  "fr-ca": {name: "French (Canadian)"},
  "fr-fr": {name: "French (France)"},
  "fr-us": {name: "French"},
  "ht-us": {name: "Creole"},
  "id-id": {name: "Indonesian"},
  "it-it": {name: "Italian"},
  "ja-jp": {name: "Japanese"},
  "ko-kr": {name: "Korean"},
  "nl-nl": {name: "Dutch"},
  "no-no": {name: "Norwegian"},
  "pt-br": {name: "Portuguese (Brazil)"},
  "pt-pt": {name: "Portuguese"},
  "ru-ru": {name: "Russian"},
  "sv-se": {name: "Swedish"},
  "th-th": {name: "Thai"},
  "vi-vn": {name: "Vietnamese"},
  "zh-cn": {name: "Chinese (Simplified)"},
  "zh-hant": {name: "Chinese (Traditional)"}
};

const stringify = (object) => JSON.stringify(object, null, 2);

class I18nSync {
  static run() { new I18nSync().run(); }
  constructor() {
    this.locales = Object.keys(locales).map((key) => ({code: key, ...locales[key]}));
    this.translations = this.locales.reduce((map, locale) => (
      {...map, [locale.code]: {...locale, data: []}}
    ), {});
  }
  buildFiles() {
    Object.keys(this.translations).forEach((key) => this.#buildFile(this.translations[key]));
  }
  importData() {
    const data = this.#fetchData();

    Object.keys(data).forEach((key) => this.#addLocale({code: key, tree: data[key]}));
  }
  run() {
    this.importData();
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
    const translation = {key: key, locale: locale.code, value: value};

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
  // TODO: Get locales from Xavier
  #fetchData() {
    return {
      "es-pr": {
        "sub": {
          "with_1": "Yo estoy divertida"
        }
      },
      "es-us": {
        "sub": {
          "with_1": "%{name} estas divertida",
          "with_2": "%{name} estas divertida"
        },
        "survey": {
          "me": "Yo Soy",
          "not_me": "No Soy"
        }
      },
      "en-us": {
        "look": {
          "at": {
            "this": "I'm missing\n\n from es-US"
          }
        },
        "sub": {
          "with_1": "%{name} is really exciting",
          "with_2": "%{name} is really %{something}"
        },
        "survey": {
          "me": "Me",
          "not_me": "Not Me"
        }
      }
    };
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

I18nSync.run();
