import { h, Component } from "preact";
import Dimension from "../dimension";
import style from "./style";

export default class Dimensions extends Component {
  render() {
    var props = this.props;
    return (
      <ul class={style.dimensions}>
        {props.assessment.personality_types.map(function(type, i) {
          return <Dimension personalityType={type} index={i} {...props} />;
        })}
      </ul>
    );
  }
}
