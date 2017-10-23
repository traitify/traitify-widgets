import {h, Component} from "preact";
import Dimensions from "./dimensions";
import Radar from "./radar";
import Types from "./types";
import Personality from "./personality";
import Extras from "./extras";
import PersonalityTraits from "./personality-traits";

export default class DimensionBasedResults extends Component{
  componentDidMount(){
    this.props.triggerCallback("DimensionBasedResults", "initialized", this);
  }
  render(){
    return (
      <section>
        <Radar {...this.props} />
        <Types {...this.props} />
        <Personality {...this.props} />
        <Extras {...this.props} />
        <Dimensions {...this.props} />
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}
