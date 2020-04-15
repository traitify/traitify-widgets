/* eslint-disable */
import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityTips extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTips.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTips.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <div className={style.container}>
        Tips
      </div>
    );
  }
}

export {PersonalityTips as Component};
export default withTraitify(PersonalityTips);
