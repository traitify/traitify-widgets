import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

const tipTypes = [
  {disabledKey: "PersonalityTools", key: "tools", title: "Tools to Use"},
  {disabledKey: "PersonalityRoom", key: "room", title: "Room for Growth and Change"},
  {disabledKey: "PersonalitySettings", key: "settings", title: "Settings that Work for You"}
];

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
    const activeTypes = tipTypes.filter((type) => {
      if(disabledComponents.includes(type.disabledKey)) { return false; }

      return details.find(({title}) => (title === type.title));
    });

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityTips")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => setActiveType(types.find((type) => type.key === value));
  const tips = details.filter(({title}) => (title === activeType.title)).map(({body}) => body);
  const typeStyle = {width: `${100.0 / types.length}%`};

  return (
    <div className={style.container}>
      <ul className={style.tabs}>
        {types.map((type) => (
          <li key={type.key} className={activeType.key === type.key ? style.active : ""} style={typeStyle}>
            <button onClick={() => setActiveType(type)} type="button">
              <div className={style.name}>{translate(`tip_type_for_${type.key}`)}</div>
            </button>
          </li>
        ))}
      </ul>
      <div className={style.tab}>
        <div className={style.formSelect}>
          <select onChange={onChange} value={activeType.key}>
            {types.map(({key}) => (
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
