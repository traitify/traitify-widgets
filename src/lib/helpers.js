export function dangerousProps(_props) {
  const {html, ...props} = _props;

  return {...props, dangerouslySetInnerHTML: {__html: html}};
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
