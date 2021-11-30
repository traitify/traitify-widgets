import PropTypes from "prop-types";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityTraitDetails({element, ...props}) {
  const {trait: {personality_trait: trait}, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityTrait.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTrait.updated", {props, state}); });

  const type = trait.personality_type;
  const color = `#${type.badge.color_1}`;

  return (
    <div className={style.container} ref={element} style={{background: rgba(color, 8.5)}}>
      <div className={style.bar} style={{background: color}} />
      <div className={style.content}>
        <img alt={type.name} src={type.badge.image_medium} />
        <div className={style.heading}>
          {trait.name}
          <span className={style.description}>{trait.definition}</span>
        </div>
      </div>
    </div>
  );
}

PersonalityTraitDetails.defaultProps = {element: null};
PersonalityTraitDetails.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ]),
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
export default withTraitify(PersonalityTraitDetails);
