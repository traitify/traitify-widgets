import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityTrait from "../personality-trait";
import style from "./style";

class PersonalityTraits extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTraits.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    const traits = this.props.assessment.personality_traits;

    return (
      <div class={style.traits}>
        <h4 class={style.title}>Most Represented Traits</h4>
        {traits.slice(0, 5).map((trait)=>(
          <PersonalityTrait trait={trait} {...this.props} />
        ))}
        <h4 class={style.title}>Least Represented Traits</h4>
        {traits.slice(-5).map((trait)=>(
          <PersonalityTrait trait={trait} {...this.props} />
        ))}
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
