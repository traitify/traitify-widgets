import {dig} from "lib/helpers/object";
import {capitalize} from "lib/helpers/string";

export function careerOption(props, ...keys) {
  const allKeys = ["careerOptions", ...keys];

  if(dig(props, keys) != null) { return dig(props, keys); }
  if(dig(props, allKeys) != null) { return dig(props, allKeys); }
  if(dig(props, ["options", ...allKeys]) != null) { return dig(props, ["options", ...allKeys]); }
  if(dig(props, ["ui", "options", ...allKeys]) != null) { return dig(props, ["ui", "options", ...allKeys]); }
}

export function detailWithPerspective(options) {
  const {base, name} = options;
  let perspective = (options.perspective || "firstPerson").replace("Person", "");
  let detail = base.details.find((d) => (d.title === `${perspective}_person_${name}`));
  detail = detail || base.details.find((d) => (d.title === `${capitalize(perspective)} Person ${name}`));
  detail = detail && detail.body;

  if(detail) { return detail; }
  perspective = perspective === "third" ? "first" : "third";
  detail = base.details.find((d) => (d.title === `${perspective}_person_${name}`));
  detail = detail || base.details.find((d) => (d.title === `${capitalize(perspective)} Person ${name}`));

  return (detail && detail.body) || base[name];
}

export function detailsWithPerspective(options) {
  const {base, name} = options;
  let perspective = (options.perspective || "firstPerson").replace("Person", "");
  let details = base.details.filter((d) => (d.title === `${perspective}_person_${name}`));
  details = details.concat(base.details.filter((d) => (d.title === `${capitalize(perspective)} Person ${name}`)));

  if(details.length === 0) {
    perspective = perspective === "third" ? "first" : "third";
    details = base.details.filter((d) => (d.title === `${perspective}_person_${name}`));
    details = details.concat(base.details.filter((d) => (d.title === `${capitalize(perspective)} Person ${name}`)));
  }

  return details.map(({body}) => body);
}

export function getDisplayName(Component) {
  return Component.displayName || Component.name || "Component";
}

export function loadFont() {
  const fontURL = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600";

  if(!document.querySelector(`link[href='${fontURL}']`)) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.type = "text/css";
    font.href = fontURL;
    document.body.appendChild(font);
  }
}
