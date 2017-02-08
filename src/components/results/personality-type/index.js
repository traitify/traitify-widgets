import { h, Component } from "preact";
import style from "./style";

export default class PersonalityType extends Component {
  render() {
    var personalityType = this.props.personalityType.personality_type;
    return (
      <a class={style.type}>
        <div class={style.stats} style={`background: ${personalityType.badge.color_1}`}>
          <h1>55%</h1>
          <h1>{personalityType.name}</h1>
        </div>
        <div class={style.details}>
          <h3>{personalityType.name}</h3>
          <p>{personalityType.description}</p>
        </div>
      </a>
    );
  }
}
