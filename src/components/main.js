import {h, Component} from "preact";
import * as Components from "./index.js";

export default class Main extends Component{
  componentWillMount(){
    this.state = this.props.shared.state;
    this.props.shared.on("Shared.setState", ()=>{
      this.setState(this.props.shared.state);
    });
  }
  componentDidMount(){
    this.props.promise.resolve(this);
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

    return h(Components[this.props.componentName || "Default"], this.state);
  }
}
