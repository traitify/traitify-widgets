import {h, Component} from "preact";
import style from "./style";

import PersonalityTrait from "../personality-trait";

export default class PersonalityTraits extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityTraits", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let traits = this.props.assessment.personality_traits;
    return (
      <div class={style.traits}>
        {traits.map((trait)=>{
          return <PersonalityTrait trait={trait} />;
        })}
      </div>
    );
  }
}
