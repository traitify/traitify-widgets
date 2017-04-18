import { h, Component } from "preact";
import style from "./style";

import PersonalityTrait from "../personality-trait";

export default class PersonalityTraits extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount(){
    this.props.triggerCallback("PersonalityTraits", "initialized", this);
  }
  onClick(e) {
    e.preventDefault();
    this.props.triggerCallback("PersonalityTraits", "showMore", this);

    this.setState({ showMore: true });
    return false;
  }
  render() {
    if (!this.props.resultsReady()) return <div />;

    let traits = this.props.assessment.personality_traits;
    if (!this.state.showMore) traits = traits.slice(0, 8);
    return (
      <div class={style.traits}>
        {traits.map((trait)=>{
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
