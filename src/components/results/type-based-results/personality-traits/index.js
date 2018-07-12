import Component from "components/traitify-component";
import PersonalityTrait from "../personality-trait";
import style from "./style";

export default class PersonalityTraits extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTraits.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  onClick = (e)=>{
    e.preventDefault();

    const callback = this.state.showMore ? "showLess" : "showMore";
    this.traitify.ui.trigger(`PersonalityTraits.${callback}`, this);
    this.setState({showMore: !this.state.showMore});
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();
    const text = this.translate(this.state.showMore ? "show_less" : "show_more");
    let traits = this.state.assessment.personality_traits;

    if(!this.state.showMore){ traits = traits.slice(0, 8); }

    return (
      <div class={style.traits}>
        {traits.map((trait)=>(
          <PersonalityTrait trait={trait} options={options} />
        ))}
        <p class={style.center}>
          <a href="#" class={style.toggle} onClick={this.onClick}>{text}</a>
        </p>
      </div>
    );
  }
}
