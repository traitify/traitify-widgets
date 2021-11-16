import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const tipTypes = {
  firstPerson: [
    {apiKey: "Tools to Use", disableKey: "PersonalityTools", translationKey: "tools"},
    {apiKey: "Caution Zone", disableKey: "PersonalityCaution", translationKey: "room"},
    {apiKey: "Settings that Work for You", disableKey: "PersonalitySettings", translationKey: "settings"}
  ],
  thirdPerson: [
    {apiKey: "Third Person Tools to Use", disableKey: "PersonalityTools", translationKey: "tools"},
    {apiKey: "Third Person Caution Zone", disableKey: "PersonalityCaution", translationKey: "caution_zone"},
    {apiKey: "Third Person Settings that Work for Them", disableKey: "PersonalitySettings", translationKey: "settings_third_person"}
  ]
};

function PersonalityArchetypeTips({element, ...props}) {
  const {assessment, getOption, isReady, translate, ui} = props;
  const details = dig(assessment, "archetype", "details") || [];
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

  const allowHeaders = getOption("allowHeaders");
  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );
  const tips = details.filter(({title}) => (title === activeType.apiKey)).map(({body}) => body);

  return (
    <div className={style.container} ref={element}>
      {allowHeaders && <div className={style.sectionHeading}>{translate("personality_tips")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.translationKey}
            className={activeType.translationKey === type.translationKey ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {translate(`tip_type_for_${type.translationKey}`)}
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.translationKey}>
        {types.map(({translationKey: key}) => (
          <option key={key} value={key}>{translate(`tip_type_for_${key}`)}</option>
        ))}
      </select>
      <div className={style.content}>
        {tips.map((tip) => <div key={tip}>{tip}</div>)}
      </div>
    </div>
  );
}

PersonalityArchetypeTips.defaultProps = {assessment: null, element: null};
PersonalityArchetypeTips.propTypes = {
  assessment: PropTypes.shape({
    archetype: PropTypes.shape({
      details: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        }).isRequired
      ).isRequired
    })
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

export {PersonalityArchetypeTips as Component};
export default withTraitify(PersonalityArchetypeTips);
