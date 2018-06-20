import {h, Component} from "preact";
import * as Components from "./index.js";

export default class Main extends Component{
  componentWillMount(){
    this.state = this.props.shared.state;
    this.props.shared.on("Shared.setState", ()=>{
      this.setState(this.props.shared.state);
    });
    this.setComponent();
  }
  componentWillUpdate(){
    this.guessComponent();
  }
  componentDidMount(){
    this.props.shared.triggerCallback("Main", "Ready", this, {name: this.props.componentName});
  }
  setComponent(){
    let component = Components[this.props.componentName || "Default"];
    if(component){ return this.component = component; }

    let names = this.props.componentName.split(".");
    if(names.length === 2){
      const components = Components[names[0] + "Components"] || {};
      component = components[names[1]];
      if(component){ return this.component = component; }

      return this.props.shared.triggerCallback("Main", "Error", this, {
        error: `Could not find component for ${this.props.componentName}`,
        name: this.props.componentName
      });
    }

    this.guessComponent();
  }
  guessComponent(){
    if(this.component){ return; }
    if(!this.state.assessment.assessment_type){ return; }

    let components;
    if(this.state.assessment.assessment_type === "TYPE_BASED"){
      components = Components.TypeComponents;
    }else{
      components = Components.DimensionComponents;
    }

    const component = components[this.props.componentName];
    if(component){ return this.component = component; }

    this.props.shared.triggerCallback("Main", "Error", this, {
      error: `Could not find component for ${this.props.componentName}`,
      name: this.props.componentName
    });
  }
  render(){
    let fontURL = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600";
    let font = document.querySelector(`link[href='${fontURL}']`);
    if(!font){
      font = document.createElement("link");
      font.rel = "stylesheet";
      font.type = "text/css";
      font.href = fontURL;
      document.body.appendChild(font);
    }

    return h(this.component || "div", this.state);
  }
}
