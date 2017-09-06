import {h, Component} from "preact";

import PersonalityTypeBarChart from "../personality-type-bar-chart";
import PersonalityTypeSlider from "../personality-type-slider";

export default class PersonalityTypes extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypes", "initialized", this);
  }
  render(){
    return (
      <div>
        <PersonalityTypeBarChart {...this.props} />
        <PersonalityTypeSlider {...this.props} />
      </div>
    );
  }
}
