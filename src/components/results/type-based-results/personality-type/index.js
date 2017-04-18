import { h, Component } from "preact";
import style from "./style";

import PersonalityBadge from "../personality-badge";

export default class PersonalityType extends Component {
  componentDidMount(){
    this.props.triggerCallback("PersonalityType", "initialized", this);
  }
  render() {
    if (!this.props.resultsReady()) return <div />;

    let type = this.props.assessment.personality_types[0].personality_type;

    return (
      <div class={style.type}>
        <PersonalityBadge type={type} />
        <h3 class={style.name}>{type.name}</h3>
        <p class={style.description}>{type.description}</p>
      </div>
    );
  }
}
