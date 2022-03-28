import PropTypes from "prop-types";
import {Component} from "react";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityType extends Component {
  static propTypes = {
    type: PropTypes.shape({
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired
        }),
        level: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired,
      score: PropTypes.number.isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityType.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityType.updated", this);
  }
  render() {
    const type = this.props.type.personality_type;
    const color = `#${type.badge.color_1}`;

    return (
      <li className={style.type} style={{borderLeft: `5px solid ${color}`}}>
        <div className={style.main} style={{background: rgba(color, 8.5)}}>
          <div className={style.content}>
            <h2 className={style.title}>
              {type.name}
              <span className={style.score}>{this.props.type.score} - {type.level}</span>
            </h2>
          </div>
        </div>
      </li>
    );
  }
}

export {PersonalityType as Component};
export default withTraitify(PersonalityType);
