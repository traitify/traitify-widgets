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
        The li above needs 2 styles:<br />
        - border: 3px solid BADGE_COLOR<br />
        - background: rgba(BADGE_COLOR_RGB, 10%)<br />

        <h2>Name <span>|</span> Score</h2>

        <p>The span in the h2 above needs 1 style:<br />- color: BADGE_COLOR</p>

        <ul className={style.dimensionHigher}>
          <li>misplaces items</li>
          <li>Each li in this list needs 1 style:<br />- background: rgba(BADGE_COLOR_RGB, 50%)</li>
        </ul>
      </li>
    );
  }
}

export {PersonalityDimension as Component};
export default withTraitify(PersonalityDimension);
