import {Component} from "react";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style";

class PersonalityBlend extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityBlend.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityBlend.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    const blend = this.props.assessment.personality_blend;
    if(!blend){ return null; }

    return (
      <div className={style.blend}>
        <PersonalityBadge type={blend.personality_type_1} {...this.props} />
        <PersonalityBadge type={blend.personality_type_2} {...this.props} />
        <h3 className={style.name}>{blend.name}</h3>
        <p className={style.description}>{blend.description}</p>
      </div>
    );
  }
}

export {PersonalityBlend as Component};
export default withTraitify(PersonalityBlend);
