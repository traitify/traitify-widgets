import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style";

class PersonalityType extends Component{
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired
  }
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
