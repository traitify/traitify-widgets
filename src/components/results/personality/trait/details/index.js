import PropTypes from "prop-types";
import {Component as Paradox} from "components/paradox/results/personality/trait/details";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityTraitDetails(props) {
  const {trait: {personality_trait: trait}, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityTrait.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTrait.updated", {props, state}); });

  const type = trait.personality_type;
  const color = `#${type.badge.color_1}`;

  return (
    <div className={style.trait} style={{background: rgba(color, 8.5)}}>
      <div className={style.bar} style={{width: "100%", background: color}} />
      <div className={style.content}>
        <img src={type.badge.image_medium} alt={type.name} className={style.icon} />
        <h3 className={style.name}>
          {trait.name}
          <span className={style.description}>{trait.definition}</span>
        </h3>
      </div>
    </div>
  );
}

PersonalityTraitDetails.propTypes = {
  trait: PropTypes.shape({
    personality_trait: PropTypes.shape({
      definition: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired,
          image_medium: PropTypes.string.isRequired
        }),
        name: PropTypes.string.isRequired
      })
    }).isRequired
  }).isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityTraitDetails as Component};
export default withTraitify(PersonalityTraitDetails, {paradox: Paradox});
