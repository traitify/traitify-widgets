import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityTrait from "../personality-trait";
import style from "./style";

class PersonalityTraits extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTraits.initialized", this);
  }
  onClick = (e)=>{
    e.preventDefault();

    const callback = this.state.showMore ? "showLess" : "showMore";
    this.props.traitify.ui.trigger(`PersonalityTraits.${callback}`, this);
    this.setState({showMore: !this.state.showMore});
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    const text = this.props.i18n.translate(this.state.showMore ? "show_less" : "show_more");
    let traits = this.props.assessment.personality_traits;

    if(!this.state.showMore){ traits = traits.slice(0, 8); }

    return (
      <div class={style.traits}>
        {traits.map((trait)=>(
          <PersonalityTrait trait={trait} {...this.props} />
        ))}
        <p class={style.center}>
          <a href="#" class={style.toggle} onClick={this.onClick}>{text}</a>
        </p>
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
