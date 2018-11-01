import {Component} from "react";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class PersonalityTrait extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTrait.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTrait.updated", this);
  }
  render(){
    const trait = this.props.trait.personality_trait;
    const type = trait.personality_type;
    const color = `#${type.badge.color_1}`;

    return (
      <div className={style.trait} style={{background: rgba(color, 8.5)}}>
        <div className={style.bar} style={{width: "100%", background: color}} />
        <div className={style.content}>
          <img src={type.badge.image_medium} alt={type.name} className={style.icon} />
          <h3 className={style.name}>
            {trait.name}
            <span className={style.description}>{trait.definition}</span>
          </h3>
        </div>
      </div>
    );
  }
}

export {PersonalityTrait as Component};
export default withTraitify(PersonalityTrait);
