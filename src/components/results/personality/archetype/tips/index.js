import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

const tipTypes = {
  firstPerson: [
    {apiKey: "Tools to Use", color: "#2491c1", disableKey: "PersonalityTools", translationKey: "tools"},
    {apiKey: "Caution Zone", color: "#cb4e4e", disableKey: "PersonalityCaution", translationKey: "room"},
    {apiKey: "Settings that Work for You", color: "#47bb55", disableKey: "PersonalitySettings", translationKey: "settings"}
  ],
  thirdPerson: [
    {apiKey: "Third Person Tools to Use", color: "#2491c1", disableKey: "PersonalityTools", translationKey: "tools"},
    {apiKey: "Third Person Caution Zone", color: "#cb4e4e", disableKey: "PersonalityCaution", translationKey: "caution_zone"},
    {apiKey: "Third Person Settings that Work for Them", color: "#47bb55", disableKey: "PersonalitySettings", translationKey: "settings_third_person"}
  ]
};

function PersonalityArchetypeTips(props) {
  const {assessment, getOption, isReady, translate, ui} = props;
  const details = dig(assessment, ["archetype", "details"]) || [];
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const state = {activeType, types};

  useDidMount(() => { ui.trigger("PersonalityTips.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTips.updated", {props, state}); });
  useEffect(() => {
    if(details.length === 0) { return; }

    const disabledComponents = getOption("disabledComponents") || [];
    const filter = (type) => {
      if(disabledComponents.includes(type.disableKey)) { return false; }

      return details.find(({title}) => (title === type.apiKey));
    };
    const perspective = getOption("perspective") || "firstPerson";
    let activeTypes = tipTypes[perspective].filter(filter);
    if(activeTypes.length === 0 && perspective === "thirdPerson") {
      activeTypes = tipTypes.firstPerson.filter(filter);
    }

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityTips")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );
  const tips = details.filter(({title}) => (title === activeType.apiKey)).map(({body}) => body);
  const typeStyle = {width: `${100.0 / types.length}%`};

  return (
    <div className={style.container}>
      <ul className={style.tabs}>
        {types.map((type) => (
          <li key={type.translationKey} className={activeType.translationKey === type.translationKey ? style.active : ""} style={typeStyle}>
            <button onClick={() => setActiveType(type)} type="button">
              <div className={style.name} style={{color: type.color}}>{translate(`tip_type_for_${type.translationKey}`)}</div>
            </button>
          </li>
        ))}
      </ul>
      <div className={style.tab}>
        <div className={style.formSelect}>
          <select onChange={onChange} value={activeType.translationKey}>
            {types.map(({translationKey: key}) => (
              <option key={key} value={key}>{translate(`tip_type_for_${key}`)}</option>
            ))}
          </select>
        </div>
        <ul className={style.list}>
          {tips.map((tip) => (<li key={tip}>{tip}</li>))}
        </ul>
      </div>
    </div>
  );
}

PersonalityArchetypeTips.defaultProps = {assessment: null};
PersonalityArchetypeTips.propTypes = {
  assessment: PropTypes.shape({archetype: PropTypes.object}),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityArchetypeTips as Component};
export default withTraitify(PersonalityArchetypeTips);
