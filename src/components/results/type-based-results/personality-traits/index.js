import { h, Component } from "preact";
import style from "./style";

import PersonalityTrait from "../personality-trait";

export default class PersonalityTypes extends Component {
  render() {
    return (
      <div>
        {this.props.assessment.personality_traits.map(function(trait) {
          return <PersonalityTrait trait={trait} />
        })}
        <p class={style.center}>
          <a href="#" class={style.showMore}>View More Traits</a>
        </p>
      </div>
    );
  }
}
