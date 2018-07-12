import Component from "components/traitify-component";
import Color from "lib/color-helpers";
import style from "./style";

export default class PersonalityTrait extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTrait.initialized", this);
  }
  render(){
    const trait = this.props.trait.personality_trait;
    const type = trait.personality_type;
    const color = `#${type.badge.color_1}`;

    return (
      <div class={style.trait} style={`background: ${Color.rgba(color, 8.5)};`}>
        <div class={style.bar} style={`width: 100%; background: ${color};`} />
        <div class={style.content}>
          <img src={type.badge.image_medium} alt={type.name} class={style.icon} />
          <h3 class={style.name}>
            {trait.name}
            <span class={style.description}>{trait.definition}</span>
          </h3>
        </div>
      </div>
    );
  }
}
