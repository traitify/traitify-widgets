import PropTypes from "prop-types";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityDimensionColumn(props) {
  const {translate, type: {personality_type: {badge, level, name}, score}, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensionColumn.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionColumn.updated", {props, state}); });

  const color = `#${badge.color_1}`;
  let backgroundClass;
  switch(true) {
    case score <= 3: backgroundClass = "low"; break;
    case score <= 6: backgroundClass = "medium"; break;
    default: backgroundClass = "high";
  }

  return (
    <li className={style.container}>
      <div>
        <div
          className={style.icon}
          style={{border: `3px solid ${color}`, background: rgba(color, 8.5)}}
        >
          <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
        </div>
        <h3>{name}</h3>
        <h2>{level}</h2>
      </div>
      <div
        className={`${style.background} ${style[backgroundClass]}`}
        style={{background: rgba(color, 10)}}
      />
    </li>
  );
}

PersonalityDimensionColumn.propTypes = {
  translate: PropTypes.func.isRequired,
  type: PropTypes.shape({
    personality_type: PropTypes.shape({
      badge: PropTypes.shape({
        color_1: PropTypes.string.isRequired,
        image_medium: PropTypes.string.isRequired
      }).isRequired,
      level: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    score: PropTypes.number.isRequired
  }).isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionColumn as Component};
export default withTraitify(PersonalityDimensionColumn);
