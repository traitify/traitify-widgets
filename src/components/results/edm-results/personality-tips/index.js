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
        <ul className={style.tipsTabs}>
          <li className={style.active}>
            <button>
              <div className={style.tipName}>Tools to Use</div>
            </button>
          </li>
          <li>
            <button>
              <div className={style.tipName}>Room for Growth and Change</div>
            </button>
          </li>
          <li>
            <button>
              <div className={style.tipName}>Settings That Work For You</div>
            </button>
          </li>
        </ul>

        <div className={style.tipsTabBox}>
          <div className={style.formSelect}>
            <select>
              <option>Tools to Use</option>
              <option>Room for Growth and Change</option>
              <option>Settings That Work For You</option>
            </select>
          </div>
          <ul className={style.tips}>
            <li>Find ways to innovate. Does a remote workforce have needs that your company could fill?</li>
            <li>Check in on colleagues to help them meet daily goals if needed.</li>
            <li>Change your workspace from time to time. Work while standing to keep your energy up.</li>
            <li>Send supportive messages to coworkers to help ensure everyone is motivated and productive.</li>
            <li>You're naturally calm and steady. Be positive during video chats.</li>
          </ul>
        </div>
      </div>
    );
  }
}

export {PersonalityTips as Component};
export default withTraitify(PersonalityTips);
