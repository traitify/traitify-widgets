import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeBar from "../personality-type-bar";

export default class PersonalityTypeBarChart extends Component {
  render() {
    var types = this.props.assessment.personality_types;
    return (
      <div class={style.chart}>
        <div>
          {types.map(function(type, index) {
            return <PersonalityTypeBar type={type} index={index} length={types.length} />;
          })}
        </div>
      </div>
    );
  }
}
