import {h, Component} from "preact";
import Dimensions from "./dimensions";
import Radar from "./radar";

export default class DimensionBasedResults extends Component{
  componentDidMount(){
    this.props.triggerCallback("DimensionBasedResults", "initialized", this);
  }
  render(){
    return (
      <section>
        <Radar {...this.props} />
        <Dimensions {...this.props} />
      </section>
    );
  }
}
