const fs = require("node:fs");

const locales = [
  "de-de",
  "en-gb",
  "en-us",
  "es-us",
  "fr-ca",
  "fr-fr",
  "ht-us",
  "id-id",
  "it-it",
  "ja-jp",
  "ko-kr",
  "nl-nl",
  "no-no",
  "pt-br",
  "pt-pt",
  "ru-ru",
  "sv-se",
  "th-th",
  "vi-vn",
  "zh-cn",
  "zh-hant",
  "locale-data_template"
];

function main() {
  const dataPath = "./src/lib/i18n-data";
  const exportPath = dataPath;
  const requiredTranslations = [];
  const enUS = JSON.parse(fs.readFileSync(`${dataPath}/en-us.json`, {encoding: "utf8", flag: "r"}));

  eachKey({fn: ({key, value}) => {
    requiredTranslations.push({key, value});
  }, object: enUS});

  locales.map((locale) => {
    const data = JSON.parse(fs.readFileSync(`${dataPath}/${locale}.json`, {encoding: "utf8", flag: "r"}));
    const currentTranslations = {}
    const translations = {};

    eachKey({fn: ({key, value}) => {
      currentTranslations[key] = value;
    }, object: data});

    requiredTranslations.forEach(({key}) => {
      const value = currentTranslations[key] || "";

      setNested({keys: key.split("."), object: translations, value});
    });

    fs.writeFileSync(`${exportPath}/${locale}.json`, JSON.stringify(translations, null, 2));
  });
}

function eachKey({fn, object, scope}) {
  if(object === null || typeof object !== "object") { return fn({key: scope, value: object}); }
  if(Array.isArray(object)) {
    return object.map((value, index) => eachKey({fn, object: value, scope: scope ? `${scope}.${index}` : index}));
  }

  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, eachKey({fn, object: value, scope: scope ? `${scope}.${key}` : key})])
  );
}

function setNested({keys: _keys, object, value}) {
  const [key, ...keys] = _keys;

  if(keys.length === 0) {
    object[key] = value;
    return;
  }

  if(!object[key]) { object[key] = {}; }

  return setNested({keys, object: object[key], value});
}

main();
