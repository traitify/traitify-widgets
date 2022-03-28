import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {Component as Paradox} from "components/paradox/results/personality/archetype/skills";
import {sortByTypePosition} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const skillTypes = [
  {
    image: "https://cdn.traitify.com/images/big5_stress.png",
    key: "dealing_with_stress",
    name: "Dealing With Stress"
  },
  {
    image: "https://cdn.traitify.com/images/big5_leading.png",
    key: "leading_others",
    name: "Leading Others"
  },
  {
    image: "https://cdn.traitify.com/images/big5_communication.png",
    key: "communication",
    name: "Communication"
  },
  {
    image: "https://cdn.traitify.com/images/big5_teamwork.png",
    key: "teamwork",
    name: "Teamwork"
  },
  {
    image: "https://cdn.traitify.com/images/big5_motivation.png",
    key: "habits",
    name: "Habits To Build"
  }
];

function PersonalityArchetypeSkills(props) {
  const {assessment, getOption, isReady, translate, ui} = props;
  const details = dig(assessment, "archetype", "details") || [];
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const state = {activeType, types};

  useDidMount(() => { ui.trigger("PersonalitySkills.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalitySkills.updated", {props, state}); });
  useEffect(() => {
    if(details.length === 0) { return; }

    const disabledComponents = getOption("disabledComponents") || [];
    const activeTypes = skillTypes.filter((type) => {
      if(disabledComponents.includes(type.name)) { return false; }

      return details.find(({title}) => (title.startsWith(`${type.name} - Success Skills`)));
    });

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalitySkills")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => setActiveType(types.find((type) => type.key === value));
  const typeTips = details
    .filter(({title}) => title.startsWith(`${activeType.name} - Success Skills`));
  const dimensions = sortByTypePosition(assessment.personality_types);
  const tips = [];
  dimensions.forEach(({personality_type: {badge, name}}) => {
    const tip = typeTips.find(({title}) => title.endsWith(name));
    if(tip) { tips.push({body: tip.body, color: `#${badge.color_1}`}); }
  });

  return (
    <div className={style.container}>
      <ul className={style.tabs}>
        <div className={style.featured}>{translate("featured_skill")}</div>
        {types.map((type) => (
          <li key={type.key} className={activeType.key === type.key ? style.active : ""}>
            <button onClick={() => setActiveType(type)} type="button">
              <img
                alt={translate(`skill_name_for_${type.key}`)}
                className={style.image}
                src={type.image}
              />
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
          {tips.map(({body, color}) => (
            <li key={body} style={{background: rgba(color, 10)}}>{body}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

PersonalityArchetypeSkills.defaultProps = {assessment: null};
PersonalityArchetypeSkills.propTypes = {
  assessment: PropTypes.shape({
    archetype: PropTypes.shape({
      details: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        }).isRequired
      ).isRequired
    }),
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          badge: PropTypes.shape({
            color_1: PropTypes.string.isRequired
          }).isRequired,
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    )
  }),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityArchetypeSkills as Component};
export default withTraitify(PersonalityArchetypeSkills, {paradox: Paradox});
