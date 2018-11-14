import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import Dimension from "../dimension";
import style from "./style";

class Dimensions extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired
  }
  componentDidMount() {
    this.props.traitify.ui.trigger("Dimensions.initialized", this);
  }
  componentDidUpdate() {
    this.props.traitify.ui.trigger("Dimensions.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <ul className={style.dimensions}>
        {this.props.assessment.personality_types.map((type, i) => (
          <Dimension key={type.personality_type.id} type={type} index={i} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {Dimensions as Component};
export default withTraitify(Dimensions);
