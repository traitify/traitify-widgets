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
        <ul className={style.skillsTabs}>
          <div className={style.featuredSkill}>Featured Skill</div>
          <li className={style.active}>
            <button>
              <img src="https://cdn.traitify.com/images/big5_home.png" alt="Working From Home Tips" className={style.skillImage} />
              <div className={style.skillName}>Working From Home Tips</div>
            </button>
          </li>
          <li>
            <button>
              <img src="https://cdn.traitify.com/images/big5_stress.png" alt="Dealing With Stress" className={style.skillImage} />
              <div className={style.skillName}>Dealing With Stress</div>
            </button>
          </li>
          <li>
            <button>
              <img src="https://cdn.traitify.com/images/big5_communication.png" alt="Communication Tips" className={style.skillImage} />
              <div className={style.skillName}>Communication Tips</div>
            </button>
          </li>
          <li>
            <button>
              <img src="https://cdn.traitify.com/images/big5_teamwork.png" alt="Teamwork" className={style.skillImage} />
              <div className={style.skillName}>Teamwork</div>
            </button>
          </li>
          <li>
            <button>
              <img src="https://cdn.traitify.com/images/big5_motivation.png" alt="Self Motivation" className={style.skillImage} />
              <div className={style.skillName}>Self Motivation</div>
            </button>
          </li>
        </ul>

        <div className={style.skillsTabBox}>
          <div className={style.formSelect}>
            <select>
              <option>Working From Home Tips</option>
              <option>Dealing With Stress</option>
              <option>Communication Tips</option>
              <option>Teamwork</option>
              <option>Self Motivation</option>
            </select>
          </div>
          <h3>Here are some useful tips that will help your performance while working from home.</h3>
          <ul className={style.skills}>
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

export {PersonalitySkills as Component};
export default withTraitify(PersonalitySkills);
