import {render, unmountComponentAtNode} from "react-dom";
import {v4 as createUUID} from "uuid";
import {unique} from "lib/helpers/array";
import guessComponent from "lib/helpers/guess-component";

export default class TraitifyWidget {
  constructor(ui, options = {}) {
    this.id = createUUID();
    this.ui = ui;
    this.options = {allowInstructions: true, allowHeaders: false, ...options};
    this.options.disabledComponents = [...this.options.disabledComponents || []];
    this.options.slideDeck = {...this.options.slideDeck};
    this.options.targets = {...this.options.targets};
  }
  allowBack() {
    this.options.allowBack = true;

    return this;
  }
  allowComponents(components) {
    this.options.disabledComponents = this.options.disabledComponents
      .filter((component) => !components.includes(component));

    return this;
  }
  allowFullscreen() {
    this.options.allowFullscreen = true;

    return this;
  }
  allowHeaders() {
    this.options.allowHeaders = true;

    return this;
  }
  allowInstructions() {
    this.options.allowInstructions = true;

    return this;
  }
  assessmentID(assessmentID) {
    this.options.assessmentID = assessmentID;

    return this;
  }
  benchmarkID(benchmarkID) {
    this.options.benchmarkID = benchmarkID;

    return this;
  }
  destroy() {
    Object.keys(this.options.renderedTargets || {}).forEach((name) => {
      const target = this.options.renderedTargets[name];

      if(target && target.isConnected) { unmountComponentAtNode(target); }
    });

    return this;
  }
  disableBack() {
    this.options.allowBack = false;

    return this;
  }
  disableComponents(components) {
    this.options.disabledComponents = unique(this.options.disabledComponents.concat(components));

    return this;
  }
  disableFullscreen() {
    this.options.allowFullscreen = false;

    return this;
  }
  disableHeaders() {
    this.options.allowHeaders = false;

    return this;
  }
  disableInstructions() {
    this.options.allowInstructions = false;

    return this;
  }
  locale(locale) {
    this.options.locale = locale.toLowerCase();

    return this;
  }
  on(key, callback) {
    this.ui.on(`Widget-${this.id}.${key}`, callback);

    return this;
  }
  perspective(perspective) {
    this.options.perspective = perspective;

    return this;
  }
  refresh() {
    this.render();

    return this;
  }
  render(componentName) {
    if(this.options.target) {
      this.options.targets[componentName || "Default"] = this.options.target;
    }

    const promises = [];

    if(Object.keys(this.options.targets).length === 0) {
      promises.push(new Promise((resolve, reject) => {
        reject(new Error("You did not specify a target"));
      }));
    }

    Object.keys(this.options.targets).forEach((name) => {
      promises.push(new Promise((resolve, reject) => {
        const Component = guessComponent(name);
        if(!Component) { return reject(new Error(`Could not find component for ${name}`)); }

        if(typeof this.options.targets[name] === "string") {
          this.options.targets[name] = document.querySelector(this.options.targets[name]);
        }

        const target = this.options.targets[name];
        if(!target) { return reject(new Error(`Could not select target for ${name}`)); }
        if(target.isConnected) { unmountComponentAtNode(target); }

        resolve(render(
          <Component widgetID={this.id} options={this.options} ui={this.ui} />,
          target
        ));
      }));
    });

    Object.keys(this.options.renderedTargets || {}).forEach((name) => {
      if(this.options.targets[name]) { return; }

      const target = this.options.renderedTargets[name];
      if(target && target.isConnected) { unmountComponentAtNode(target); }
    });
    this.options.renderedTargets = {...this.options.targets};

    return Promise.all(promises);
  }
  surveyType(surveyType) {
    this.options.surveyType = surveyType.toLowerCase();

    return this;
  }
  target(target) {
    this.options.target = target;

    return this;
  }
  targets(targets) {
    this.options.targets = targets;

    return this;
  }
  theme(theme) {
    this.options.theme = theme;

    return this;
  }
  view(view) {
    this.options.view = view;

    return this;
  }
}
