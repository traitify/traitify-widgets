import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {sortByTypePosition} from "lib/helpers";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const skillTypes = [
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/stress-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/stress-default.png"
    },
    key: "dealing_with_stress",
    name: "Dealing With Stress"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/leading-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/leading-default.png"
    },
    key: "leading_others",
    name: "Leading Others"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/chat-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/chat-default.png"
    },
    key: "communication",
    name: "Communication"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/teamwork-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/teamwork-default.png"
    },
    key: "teamwork",
    name: "Teamwork"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/build-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/build-default.png"
    },
    key: "habits",
    name: "Habits To Build"
  }
];

function PersonalityArchetypeSkills({element, ...props}) {
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

      return details.find(({title}) => title.startsWith(`${type.name} - Success Skills`));
    });

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalitySkills")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeType) { return null; }

  const allowHeaders = getOption("allowHeaders");
  const onChange = ({target: {value}}) => setActiveType(types.find((type) => type.key === value));
  const typeTips = details.filter(({title}) => title.startsWith(`${activeType.name} - Success Skills`));
  const tips = [];
  sortByTypePosition(assessment.personality_types).forEach(({personality_type: {name}}) => {
    const tip = typeTips.find(({title}) => title.endsWith(name));
    if(tip) { tips.push(tip.body); }
  });

  return (
    <div className={style.container} ref={element}>
      {allowHeaders && <div className={style.sectionHeading}>{translate("success_skills")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.key}
            className={activeType.key === type.key ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            <img
              alt={translate(`skill_name_for_${type.key}`)}
              className={style.image}
              src={type.image[activeType.key === type.key ? "active" : "default"]}
            />
            <div>{translate(`skill_name_for_${type.key}`)}</div>
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.key}>
        {types.map(({key}) => (
          <option key={key} value={key}>{translate(`skill_name_for_${key}`)}</option>
        ))}
      </select>
      <div className={style.content}>
        <div className={style.heading}>{translate(`skill_heading_for_${activeType.key}`)}</div>
        {tips.map((tip) => <div key={tip} className={style.tip}>{tip}</div>)}
      </div>
    </div>
  );
}

PersonalityArchetypeSkills.defaultProps = {assessment: null, element: null};
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
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ]),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityArchetypeSkills as Component};
export default withTraitify(PersonalityArchetypeSkills);
