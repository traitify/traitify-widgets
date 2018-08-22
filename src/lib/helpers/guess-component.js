import * as Components from "components";
import componentFromAssessment from "lib/helpers/component-from-assessment";

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
  }else{
    const dimensionComponent = Components.DimensionComponents[name];
    const typeComponent = Components.TypeComponents[name];
    if(dimensionComponent && typeComponent){
      return componentFromAssessment({
        DIMENSION_BASED: dimensionComponent,
        TYPE_BASED: typeComponent
      });
    }else{
      return dimensionComponent || typeComponent;
    }
  }

  return Components[componentType][componentName];
}
