import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style";

class PersonalityType extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityType.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    const type = this.props.assessment.personality_types[0].personality_type;

    return (
      <div class={style.type}>
        <PersonalityBadge type={type} {...this.props} />
        <h3 class={style.name}>{type.name}</h3>
        <p class={style.description}>{type.description}</p>
      </div>
    );
  }
}

export {PersonalityType as Component};
export default withTraitify(PersonalityType);
