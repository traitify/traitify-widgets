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

    this.setState((state, props)=>{
      const {showMore} = state;
      const key = showMore ? "showLess" : "showMore";
      props.traitify.ui.trigger(`PersonalityTraits.${key}`, this);

      return {showMore: !showMore};
    });
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
          <button className={style.toggle} onClick={this.onClick} type="button">{text}</button>
        </p>
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
