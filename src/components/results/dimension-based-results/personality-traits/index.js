import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import PersonalityTrait from "../personality-trait";
import style from "./style";

class PersonalityTraits extends Component{
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_traits: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired,
    translate: PropTypes.func.isRequired
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTraits.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTraits.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    const traits = this.props.assessment.personality_traits;

    return (
      <div className={style.traits}>
        <h4 className={style.title}>{this.props.translate("most_represented_traits")}</h4>
        {traits.slice(0, 5).map((trait)=>(
          <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...this.props} />
        ))}
        <h4 className={style.title}>{this.props.translate("least_represented_traits")}</h4>
        {traits.slice(-5).map((trait)=>(
          <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...this.props} />
        ))}
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
