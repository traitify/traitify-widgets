import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeSlide from "../personality-type-slide";

export default class PersonalityTypeSlider extends Component {
  render() {
    var types = this.props.assessment.personality_types;
    return (
      <div>
        <ul class={style.slider}>
          {types.map(function(type, index) {
            return <PersonalityTypeSlide type={type} index={index} length={types.length} />;
          })}
        </ul>
      </div>
    );
  }
}
