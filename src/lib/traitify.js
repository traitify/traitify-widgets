/* global VERSION */
import {render, unmountComponentAtNode} from "react-dom";
import Components from "components";

const componentFromString = (name) => name.split(".").reduce((current, key) => current[key], Components);

export default class Traitify {
  constructor(props) {
    this.__version__ = VERSION;
    this.props = props || {};
  }
  destroy() {
    Object.keys(this.renderedTargets || {}).forEach((name) => {
      const target = this.renderedTargets[name];

      if(target && target.isConnected) { unmountComponentAtNode(target); }
    });

    return this;
  }
  render(_targets) {
    const targets = typeof _targets === "string" || _targets instanceof HTMLElement
      ? {Default: _targets}
      : _targets;
    const promises = [];

    if(Object.keys(targets).length === 0) {
      promises.push(new Promise((resolve, reject) => {
        reject(new Error("You did not specify a target"));
      }));
    }

    Object.keys(targets).forEach((name) => {
      promises.push(new Promise((resolve, reject) => {
        const Component = componentFromString(name);
        if(!Component) { return reject(new Error(`Could not find component for ${name}`)); }

        if(typeof targets[name] === "string") {
          targets[name] = document.querySelector(targets[name]);
        }

        const target = targets[name];
        if(!target) { return reject(new Error(`Could not select target for ${name}`)); }
        if(target.isConnected) { unmountComponentAtNode(target); }

        resolve(render(
          <Components.Container {...this.props}>
            <Component />
          </Components.Container>,
          target
        ));
      }));
    });

    Object.keys(this.renderedTargets || {}).forEach((name) => {
      if(targets[name]) { return; }

      const target = this.renderedTargets[name];
      if(target && target.isConnected) { unmountComponentAtNode(target); }
    });
    this.renderedTargets = {...targets};

    return Promise.all(promises);
  }
}
