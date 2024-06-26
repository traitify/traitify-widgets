/* global VERSION */
import {createRoot} from "react-dom/client";
import Components from "components";
import componentFromString from "lib/common/component-from-string";
import except from "lib/common/object/except";
import slice from "lib/common/object/slice";
import split from "lib/common/object/split";
import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";

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

export default class Traitify {
  constructor(options) {
    this.__version__ = VERSION;
    this.http = new Http();
    this.i18n = new I18n();
    this.listener = new Listener();
    this.options = options || {};
    this.renderedTargets = {};
  }
  get props() {
    const objects = slice(this, [
      "http",
      "i18n",
      "listener"
    ]);
    const [props, options] = split(this.options, [
      "assessmentID",
      "benchmarkID",
      "graphql",
      "locale",
      "packageID",
      "profileID"
    ]);

    return {...objects, ...props, options};
  }
  destroy(targets) {
    Object.keys(targets || this.renderedTargets).forEach((name) => {
      const component = this.renderedTargets[name];
      if(!component) { return; }
      if(component.root) { component.root.unmount(); }
    });

    this.renderedTargets = {};

    return this;
  }
  render(_targets = {}) {
    const promises = [];
    const targets = formatTargets(_targets);

    if(Object.keys(targets).length === 0) {
      promises.push(new Promise((resolve, reject) => {
        reject(new Error("You did not specify a target"));
      }));
    }

    Object.keys(targets).forEach((name) => {
      promises.push(new Promise((resolve, reject) => {
        const Component = componentFromString(name);
        if(!Component) { return reject(new Error(`Could not find component for ${name}`)); }

        const {props, root, target} = targets[name];
        if(!target) { return reject(new Error(`Could not select target for ${name}`)); }
        if(!root) { targets[name].root = createRoot(target); }

        resolve(targets[name].root.render(
          <Components.Container {...this.props}>
            <Component {...props} />
          </Components.Container>
        ));
      }));
    });

    this.destroy(except(this.renderedTargets, Object.keys(targets)));
    this.renderedTargets = {...targets};

    return Promise.all(promises);
  }
  updateLocale(value) {
    this.listener.trigger("updateLocale", value);
    this.options.locale = value;
  }
}
