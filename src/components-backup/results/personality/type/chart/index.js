import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {detailWithPerspective} from "lib/helpers";
import {reverse} from "lib/helpers/array";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityTypeChart({setElement, ...props}) {
  const {assessment, getOption, translate, ui} = props;
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const state = {activeType};

  useDidMount(() => { ui.trigger("PersonalityTypeChart.initialized", {props, state}); });
  useDidMount(() => { ui.trigger("PersonalityTypes.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTypeChart.updated", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTypes.updated", {props, state}); });
  useEffect(() => {
    const _types = dig(assessment, "personality_types") || [];
    if(_types.length === 0) { return; }

    const data = _types.map(({personality_type: type, score}) => ({...type, score}));

    setTypes(data);
    setActiveType(data[0]);
  }, [dig(assessment, "personality_types")]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityTypes")) { return null; }
  if(!activeType) { return null; }

  const allowHeaders = getOption("allowHeaders");
  const max = Math.max(...types.map(({score}) => score)) > 10 ? 100 : 10;
  const scale = [0, max * 0.25, max * 0.5, max * 0.75, max];
  const showType = (newID) => setActiveType(types.find(({id}) => newID === id));
  const onChange = ({target: {value}}) => showType(value);

  let description = detailWithPerspective({
    base: activeType,
    name: "description",
    perspective: getOption("perspective")
  });
  let title = activeType.name;

  if(description.startsWith("'")) {
    title = description.split("'")[1];
    description = description.split("'").splice(2).join("'");

    if(description.startsWith("...")) { description = description.slice(3).trim(); }
  }

  return (
    <div className={style.container} ref={setElement}>
      {allowHeaders && <div className={style.sectionHeading}>{translate("personality_breakdown")}</div>}
      <div className={style.horizontal}>
        {types.map(({badge, id, name, score: _score}, index) => {
          const score = index === 0 ? 95 : _score;
          const percent = score / (max * 0.01);
          const inlineStyle = {backgroundColor: `#${badge.color_1}`, width: `${percent}%`};
          const tooBig = score > max * 0.75;

          return (
            <div key={id} className={style.row}>
              <div className={style.label}>
                <div>{name}</div>
                <img alt={`${name} ${translate("badge")}`} src={badge.image_medium} />
              </div>
              <div className={style.grid}>
                <div className={style.bar} style={inlineStyle} />
                <div className={[style.score, tooBig && style.tooBig].filter(Boolean).join(" ")}>{max === 100 ? `${Math.round(score)}%` : score}</div>
              </div>
            </div>
          );
        })}
        <div className={style.scale}>
          {scale.map((rank) => <div key={rank} />)}
        </div>
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {reverse(scale).map((rank) => <div key={rank}>{rank}</div>)}
        </div>
        {types.map(({badge, id, score}) => {
          const percent = score / (max * 0.01);
          const inlineStyle = {backgroundColor: `#${badge.color_1}`, height: `${percent}%`};

          return (
            <div key={id} className={style.column}>
              <div className={style.bar}>
                <div className={style.score} style={inlineStyle} />
              </div>
            </div>
          );
        })}
      </div>
      <div className={style.tabs}>
        {types.map(({badge, id, name}) => (
          <button
            key={id}
            className={[id === activeType.id && style.active].filter(Boolean).join(" ")}
            onClick={() => showType(id)}
            type="button"
          >
            <span>
              <img alt={`${name} ${translate("badge")}`} src={badge.image_medium} />
              {name}
            </span>
          </button>
        ))}
      </div>
      <div className={style.content}>
        <select className={style.dropdown} onChange={onChange} value={activeType.id}>
          {types.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
        <div className={style.heading}>{title}</div>
        <div className={style.p}>{description}</div>
      </div>
    </div>
  );
}

PersonalityTypeChart.defaultProps = {assessment: null};
PersonalityTypeChart.propTypes = {
  assessment: PropTypes.shape({
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          badge: PropTypes.shape({image_medium: PropTypes.string.isRequired}).isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        }).isRequired,
        score: PropTypes.number.isRequired
      }).isRequired
    )
  }),
  getOption: PropTypes.func.isRequired,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityTypeChart as Component};
export default withTraitify(PersonalityTypeChart);
