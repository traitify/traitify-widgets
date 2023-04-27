import Components from "components";
import dig from "lib/common/object/dig";

function dive(components, name) { return dig(components, ...name.split(".")); }

function findComponent(components, name) {
  const node = dive(components, name);
  if(!node) { return; }
  if(node.Container) { return node.Container; }
  if(node.List) { return node.List; }

  return node;
}

export default function componentFromString(name) {
  const component = findComponent(Components, name);
  if(component) { return component; }

  return findComponent(Components.Results, name);
}
