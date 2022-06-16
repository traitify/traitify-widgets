import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const detailTypes = [
  {apiKey: "Complement", disableKey: "PersonalityComplements", translationKey: "complements"},
  {apiKey: "Conflict", disableKey: "PersonalityConflicts", translationKey: "conflicts"},
  {apiKey: "Environments", disableKey: "PersonalityEnvironments", translationKey: "best_work_environments"}
];

function PersonalityBaseDetails({setElement, ...props}) {
  const {assessment, getOption, personality: _personality, translate, ui} = props;
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const personality = _personality || dig(assessment, "personality_blend")
    || dig(assessment, "personality_types", 0, "personality_type");
  const state = {activeType, personality, types};

  const disabledComponents = getOption("disabledComponents") || [];

  useDidMount(() => { ui.trigger("PersonalityBaseDetails.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityBaseDetails.updated", {props, state}); });
  useEffect(() => {
    if(!personality) { return; }
    if(personality.details.length === 0) { return; }

    const activeTypes = detailTypes
      .filter(({disableKey}) => !disabledComponents.includes(disableKey))
      .map((type) => {
        let data = personality.details.filter(({title}) => (title === type.apiKey))
          .map(({body}) => body);

        if(data.length === 0) {
          data = (personality[type.apiKey.toLowerCase()] || [])
            .map(({name}) => name);
        }

        return {...type, data: data.length > 1 ? data : data[0]};
      }).filter(({data}) => data);

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [personality]);

  if(disabledComponents.includes("PersonalityDetails")) { return null; }
  if(!activeType) { return null; }

  const allowHeaders = getOption("allowHeaders");
  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );

  return (
    <div className={style.container} ref={setElement}>
      {allowHeaders && <div className={style.sectionHeading}>{translate("personality_details")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.translationKey}
            className={activeType.translationKey === type.translationKey ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {translate(type.translationKey)}
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.translationKey}>
        {types.map(({translationKey: key}) => (
          <option key={key} value={key}>{translate(key)}</option>
        ))}
      </select>
      <div>
        {Array.isArray(activeType.data) ? (
          <ul>
            {activeType.data.map((data) => <li key={data}>{data}</li>)}
          </ul>
        ) : (
          <div className="p">{activeType.data}</div>
        )}
      </div>
    </div>
  );
}

const personalityPropType = PropTypes.shape({
  details: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
});

PersonalityBaseDetails.defaultProps = {assessment: null, personality: null};
PersonalityBaseDetails.propTypes = {
  assessment: PropTypes.shape({
    personality_blend: personalityPropType,
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({personality_type: personalityPropType.isRequired})
    )
  }),
  getOption: PropTypes.func.isRequired,
  personality: personalityPropType,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityBaseDetails as Component};
export default withTraitify(PersonalityBaseDetails);
