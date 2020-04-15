/* eslint-disable */
import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalitySkills extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalitySkills.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalitySkills.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <div className={style.container}>
        Skills
      </div>
    );
  }
}

export {PersonalitySkills as Component};
export default withTraitify(PersonalitySkills);
