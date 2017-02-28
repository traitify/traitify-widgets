import { h, Component } from "preact";
import style from "./style";

import PersonalityTrait from "../personality-trait";

export default class PersonalityTraits extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    e.preventDefault();
    this.setState({ showMore: true });
    return false;
  }
  render() {
    var traits = this.props.assessment.personality_traits;
    if(!this.state.showMore) { traits = traits.slice(0, 8); }
    return (
      <div class={style.traits}>
        {traits.map(function(trait) {
          return <PersonalityTrait trait={trait} />;
        })}
        {!this.state.showMore &&
          <p class={style.center}>
            <a href="#" class={style.showMore} onClick={this.onClick}>View More Traits</a>
          </p>
        }
      </div>
    );
  }
}