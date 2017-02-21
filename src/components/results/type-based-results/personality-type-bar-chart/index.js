import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeBar from "../personality-type-bar";

export default class PersonalityTypeBarChart extends Component {
  handleMouseLeave(){

    let props = this.props.assessment.personality_types.map((type)=>{
      type.personality_type.hover = false

      return type
    })

    this.props.setState(props);
  }

  render() {
    let com = this;
    var types = this.props.assessment.personality_types;
    return (
      <ul class={style.chart} onMouseLeave={this.handleMouseLeave.bind(this)}>
        {types.map(function(type, index) {
          return <PersonalityTypeBar {...com.props} type={type} index={index} length={types.length} />;
        })}
      </ul>
    );
  }
}
