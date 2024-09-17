import dig from "./object/dig";

function dive({components, name}) { return dig(components, ...name.split(".")); }

function findComponent({components, name}) {
  const node = dive({components, name});
  if(!node) { return; }
  if(node.Container) { return node.Container; }
  if(node.List) { return node.List; }

  return node;
}

export default function componentFromString({components, name}) {
  const component = findComponent({components, name});
  if(component) { return component; }

  return findComponent({components: components.Results, name});
}
