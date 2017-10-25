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
        <h4 class={style.title}>Most Represented Traits</h4>
        {traits.slice(0, 5).map((trait)=>{
          return <PersonalityTrait trait={trait} />;
        })}
        <h4 class={style.title}>Least Represented Traits</h4>
        {traits.slice(-5).map((trait)=>{
          return <PersonalityTrait trait={trait} />;
        })}
      </div>
    );
  }
}
