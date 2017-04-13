import { h, Component } from "preact";
import Dimension from "../dimension";
import style from "./style";

export default class Dimensions extends Component {
  componentDidMount(){
    this.props.triggerCallback("Dimensions", "initialized", this);
  }
  render() {
    if (!this.props.resultsReady()) return <div />;

    let props = this.props;
    return (
      <ul class={style.dimensions}>
        {props.assessment.personality_types.map((type, i) => {
          return <Dimension personalityType={type} index={i} {...props} />;
        })}
      </ul>
    );
  }
}
