import * as Components from "components";

export function loadFont(){
  const fontURL = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600";

  if(!document.querySelector(`link[href='${fontURL}']`)){
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.type = "text/css";
    font.href = fontURL;
    document.body.appendChild(font);
  }
}

export function guessComponent(name, options = {}){
  let component = Components[name || "Default"];
  if(component){ return component; }

  let componentName, componentType;
  const names = name.split(".");
  if(names.length === 2){
    componentName = names[1];
    componentType = `${names[0]}Components`;
  }else if(options.assessmentType){
    const type = options.assessmentType.slice(0, -6);

    componentName = name;
    componentType = `${type.charAt(0).toUpperCase()}${type.substring(1)}Components`;
  }else{ return; }

  return Components[componentType][componentName];
}
