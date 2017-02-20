import { h, Component } from "preact";
import Dimension from "../dimension";
import Radar from "../radar";
import style from "./style";

export default class Dimensions extends Component {
  render() {
    var props = this.props;
    return (
      <section>
        <Radar {...this.props} />
        <ul class={style.dimensions}>
          {this.props.assessment.personality_types.map(function(type, i) {
            return <Dimension personalityType={type} index={i} {...props} />
          })}
        </ul>
      </section>
    );
  }
}
