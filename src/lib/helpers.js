export function camelCase(string) {
  return string.replace(/-([a-z])/g, (x) => (x[1].toUpperCase()));
}

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

export function dangerousProps(_props) {
  const {html, ...props} = _props;

  return {...props, dangerouslySetInnerHTML: {__html: html}};
}

export function detailWithPerspective(options) {
  const {base, name} = options;
  let perspective = (options.perspective || "firstPerson").replace("Person", "");
  let detail = base.details.find((d) => (d.title === `${perspective}_person_${name}`));
  detail = detail && detail.body;

  if(detail) { return detail; }
  perspective = perspective === "third" ? "first" : "third";
  detail = base.details.find((d) => (d.title === `${perspective}_person_${name}`));

  return (detail && detail.body) || base[name];
}

export function getDisplayName(Component) {
  return Component.displayName || Component.name || "Component";
}

export function listId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
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
