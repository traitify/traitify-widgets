import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeSlide from "../personality-type-slide";

export default class PersonalityTypeSlider extends Component {
  render() {
    var props = this.props;

    return (
      <div>
        <ul class={style.slider}>
          {props.assessment.personality_types.map(function(type) {
            return <PersonalityTypeSlide {...props} type={type} />;
          })}
        </ul>
      </div>
    );
  }
}
