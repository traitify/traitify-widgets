import {Component} from "react";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style";

class PersonalityType extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityType.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityType.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    const type = this.props.assessment.personality_types[0].personality_type;

    return (
      <div className={style.type}>
        <PersonalityBadge type={type} {...this.props} />
        <h3 className={style.name}>{type.name}</h3>
        <p className={style.description}>{type.description}</p>
      </div>
    );
  }
}

export {PersonalityType as Component};
export default withTraitify(PersonalityType);
