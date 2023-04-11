export default function loadFont(url) {
  const fontURL = url || "https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700";

  if(!document.querySelector(`link[href='${fontURL}']`)) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.type = "text/css";
    font.href = fontURL;
    document.body.appendChild(font);
  }
}
