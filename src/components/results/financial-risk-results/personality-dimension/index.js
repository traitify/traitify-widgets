import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDimension extends Component {
  static propTypes = {
    type: PropTypes.shape({
      personality_type: PropTypes.object.isRequired,
      score: PropTypes.number.isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimension.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimension.updated", this);
  }
  render() {
    return (
      <li className={style.dimension}>
        Dimension
      </li>
    );
  }
}

export {PersonalityDimension as Component};
export default withTraitify(PersonalityDimension);
