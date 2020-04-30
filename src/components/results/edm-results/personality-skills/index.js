import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

const skills = [
  {
    image: "https://cdn.traitify.com/images/big5_home.png",
    key: "working_from_home",
    name: "Working From Home Tips"
  },
  {
    image: "https://cdn.traitify.com/images/big5_stress.png",
    key: "dealing_with_stress",
    name: "Dealing With Stress"
  },
  {
    image: "https://cdn.traitify.com/images/big5_communication.png",
    key: "communication",
    name: "Communication Tips"
  },
  {
    image: "https://cdn.traitify.com/images/big5_teamwork.png",
    key: "teamwork",
    name: "Teamwork"
  },
  {
    image: "https://cdn.traitify.com/images/big5_motivation.png",
    key: "self_motivation",
    name: "Self Motivation"
  }
];

class PersonalitySkills extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
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

    const {translate} = this.props;
    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }

    const activeSkill = skills[0];
    const onChange = () => {};
    const tips = personality.details
      .filter(({title}) => (title === `Success Skills - ${activeSkill.name}`))
      .map(({body}) => body);

    return (
      <div className={style.container}>
        <ul className={style.skillsTabs}>
          <div className={style.featuredSkill}>{translate("featured_skill")}</div>
          {skills.map(({image, key}) => (
            <li key={key} className={activeSkill.key === key ? style.active : ""}>
              <button type="button">
                <img src={image} alt={translate(`skill_name_for_${key}`)} className={style.skillImage} />
                <div className={style.skillName}>{translate(`skill_name_for_${key}`)}</div>
              </button>
            </li>
          ))}
        </ul>
        <div className={style.skillsTabBox}>
          <div className={style.formSelect}>
            <select onChange={onChange} value={activeSkill.key}>
              {skills.map(({key}) => (
                <option key={key} value={key}>{translate(`skill_name_for_${key}`)}</option>
              ))}
            </select>
          </div>
          <h3>{translate(`skill_heading_for_${activeSkill.key}`)}</h3>
          <ul className={style.skills}>
            {tips.map((tip) => (<li key={tip}>{tip}</li>))}
          </ul>
        </div>
      </div>
    );
  }
}

export {PersonalitySkills as Component};
export default withTraitify(PersonalitySkills);
