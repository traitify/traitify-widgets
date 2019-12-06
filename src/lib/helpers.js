import {capitalize} from "lib/helpers/string";

export function careerOption(props, name) {
  if(props[name] != null) { return props[name]; }
  if(props.options
    && props.options.careerOptions
    && props.options.careerOptions[name] != null
  ) { return props.options.careerOptions[name]; }
  if(props.ui
    && props.ui.options
    && props.ui.options.careerOptions
    && props.ui.options.careerOptions[name] != null
  ) { return props.ui.options.careerOptions[name]; }
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
