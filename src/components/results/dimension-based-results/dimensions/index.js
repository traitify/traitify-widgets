import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Dimension from "../dimension";
import style from "./style.scss";

class Dimensions extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("Dimensions.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("Dimensions.updated", this);
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
