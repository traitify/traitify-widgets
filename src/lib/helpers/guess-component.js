import * as Components from "components";

export default function guessComponent(name, options = {}){
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
    componentType = `${type.charAt(0).toUpperCase()}${type.substring(1).toLowerCase()}Components`;
  }else{ return; }

  return Components[componentType][componentName];
}
