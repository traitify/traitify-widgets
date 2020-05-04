import PropTypes from "prop-types";
import {useState} from "react";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

const types = [
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

function PersonalitySkills(props) {
  const {assessment, isReady, translate, ui} = props;
  const details = dig(assessment, ["archetype", "details"]) || [];
  const [activeType, setActiveType] = useState(types[0]);
  const state = {activeType};

  useDidMount(() => { ui.trigger("PersonalitySkills.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalitySkills.updated", {props, state}); });

  const tips = details
    .filter(({title}) => (title === `Success Skills - ${activeType.name}`))
    .map(({body}) => body);

  if(!isReady("results")) { return null; }
  if(tips.length === 0) { return null; }

  const onChange = ({target: {value}}) => setActiveType(types.find((type) => type.key === value));

  return (
    <div className={style.container}>
      <ul className={style.tabs}>
        <div className={style.featured}>{translate("featured_skill")}</div>
        {types.map((type) => (
          <li key={type.key} className={activeType.key === type.key ? style.active : ""}>
            <button onClick={() => setActiveType(type)} type="button">
              <img src={type.image} alt={translate(`skill_name_for_${type.key}`)} className={style.skillImage} />
              <div className={style.name}>{translate(`skill_name_for_${type.key}`)}</div>
            </button>
          </li>
        ))}
      </ul>
      <div className={style.tab}>
        <div className={style.formSelect}>
          <select onChange={onChange} value={activeType.key}>
            {types.map(({key}) => (
              <option key={key} value={key}>{translate(`skill_name_for_${key}`)}</option>
            ))}
          </select>
        </div>
        <h3>{translate(`skill_heading_for_${activeType.key}`)}</h3>
        <ul className={style.list}>
          {tips.map((tip) => (<li key={tip}>{tip}</li>))}
        </ul>
      </div>
    </div>
  );
}

PersonalitySkills.defaultProps = {assessment: null};
PersonalitySkills.propTypes = {
  assessment: PropTypes.shape({archetype: PropTypes.object}),
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalitySkills as Component};
export default withTraitify(PersonalitySkills);
