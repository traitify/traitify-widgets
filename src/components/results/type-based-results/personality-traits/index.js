import {Component} from "react";
import withTraitify from "lib/with-traitify";
import PersonalityTrait from "../personality-trait";
import style from "./style";

class PersonalityTraits extends Component{
  constructor(props){
    super(props);

    this.state = {showMore: false};
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTraits.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTraits.updated", this);
  }
  onClick = (e)=>{
    e.preventDefault();

    const callback = this.state.showMore ? "showLess" : "showMore";
    this.props.traitify.ui.trigger(`PersonalityTraits.${callback}`, this);
    this.setState({showMore: !this.state.showMore});
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    const text = this.props.translate(this.state.showMore ? "show_less" : "show_more");
    let traits = this.props.assessment.personality_traits;

    if(!this.state.showMore){ traits = traits.slice(0, 8); }

    return (
      <div className={style.traits}>
        {traits.map((trait)=>(
          <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...this.props} />
        ))}
        <p className={style.center}>
          <a href="#" className={style.toggle} onClick={this.onClick}>{text}</a>
        </p>
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
