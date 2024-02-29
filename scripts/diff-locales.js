const fs = require("node:fs");

function main() {
  const csv = [["Locale", "Key", "Value"]];
  const dataPath = "../src/lib/i18n-data";
  const exportPath = "./scripts/exports";
  const enUS = require(`${dataPath}/en-us.json`);
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
    "zh-hant"
  ];
  const requiredTranslations = [];

  eachKey({fn: ({key, value}) => {
    requiredTranslations.push({key, value});
  }, object: enUS});

  locales.forEach((locale) => {
    const data = require(`${dataPath}/${locale}.json`);
    const translations = {};

    eachKey({fn: ({key, value}) => {
      translations[key] = value;
    }, object: data});

    requiredTranslations.filter(({key}) => !translations[key]).forEach(({key, value}) => {
      csv.push([locale, key, value]);
    })
  });

  fs.writeFileSync(`${exportPath}/missing.csv`, csv.map((row) => row.join(";").replace(/\n/g, "\\n")).join("\n"));
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

main();
