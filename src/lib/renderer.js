import {createRoot} from "react-dom/client";
import componentFromString from "./common/component-from-string";
import except from "./common/object/except";

const isTarget = (target) => (typeof target === "string" || target instanceof HTMLElement);
const formatTargets = (_targets) => {
  const targets = isTarget(_targets) ? {Default: _targets} : _targets;

  return Object.fromEntries(
    Object.entries(targets).map(([key, target]) => {
      const options = isTarget(target) ? {target} : {...target};

      if(!options.props) { options.props = {}; }
      if(typeof options.target === "string") {
        options.target = document.querySelector(options.target);
      }

      return [key, options];
    })
  );
};

export default class Renderer {
  constructor({components}) {
    this.components = components;
    this.renderedTargets = {};
  }
  destroy({targets}) {
    Object.keys(targets || this.renderedTargets).forEach((name) => {
      const component = this.renderedTargets[name];
      if(!component) { return; }
      if(component.root) { component.root.unmount(); }
    });

    this.renderedTargets = {};

    return this;
  }
  render({props, targets: _targets = {}}) {
    const promises = [];
    const targets = formatTargets(_targets);

    if(Object.keys(targets).length === 0) {
      promises.push(new Promise((resolve, reject) => {
        reject(new Error("You did not specify a target"));
      }));
    }

    Object.keys(targets).forEach((name) => {
      promises.push(new Promise((resolve, reject) => {
        const Component = componentFromString({components: this.components, name});
        if(!Component) { return reject(new Error(`Could not find component for ${name}`)); }

        const {props: targetProps, root, target} = targets[name];
        if(!target) { return reject(new Error(`Could not select target for ${name}`)); }
        if(!root) { targets[name].root = createRoot(target); }

        const {Container} = this.components;

        resolve(targets[name].root.render(
          <Container {...props}>
            <Component {...targetProps} />
          </Container>
        ));
      }));
    });

    this.destroy({targets: except(this.renderedTargets, Object.keys(targets))});
    this.renderedTargets = {...targets};

    return Promise.all(promises);
  }
}
