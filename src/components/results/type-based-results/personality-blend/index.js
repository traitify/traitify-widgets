import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style";

class PersonalityBlend extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityBlend.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    const blend = this.props.assessment.personality_blend;
    if(!blend){ return; }

    return (
      <div class={style.blend}>
        <PersonalityBadge type={blend.personality_type_1} {...this.props} />
        <PersonalityBadge type={blend.personality_type_2} {...this.props} />
        <h3 class={style.name}>{blend.name}</h3>
        <p class={style.description}>{blend.description}</p>
      </div>
    );
  }
}

export {PersonalityBlend as Component};
export default withTraitify(PersonalityBlend);
