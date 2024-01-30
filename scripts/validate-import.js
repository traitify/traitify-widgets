const {parse} = require("csv-parse/sync");
const {stringify} = require("csv-stringify/sync");
const fs = require("node:fs");

// NOTE: Still requires manually updating translations with
//   - HTML
//   - Links
//   - Markdown
//   - Placeholders
function main({verified}) {
  const dataPath = "../src/lib/i18n-data";
  const exportPath = "./scripts/exports";
  const importPath = "./scripts/imports";
  const enUS = require(`${dataPath}/en-us.json`);
  const requiredTranslations = [];

  eachKey({fn: ({key, value}) => {
    requiredTranslations.push({key, value});
  }, object: enUS});

  ["id-id"].map((locale) => {
    const csv = [["Key", "en-us", "en-us import", "Translation"]];
    const data = fs.readFileSync(`${importPath}/${locale}.csv`, {encoding: "utf8", flag: "r"});
    const rows = parse(data, {skipEmptyLines: true});

    if(verified) {
      const translations = {};

      requiredTranslations.forEach(({key}, index) => {
        const [_, value] = rows[index + 1] || [];

        setNested({keys: key.split("."), object: translations, value});
      });

      fs.writeFileSync(`${exportPath}/${locale}.json`, JSON.stringify(translations, null, 2));
    } else {
      requiredTranslations.forEach(({key, value}, index) => {
        const row = rows[index + 1] || [];

        csv.push([key, value, ...row.slice(0, 2)]);
      });

      fs.writeFileSync(`${exportPath}/${locale}.csv`, stringify(csv));
    }
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

main({verified: true});
