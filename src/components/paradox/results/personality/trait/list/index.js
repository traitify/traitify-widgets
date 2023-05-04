import PropTypes from "prop-types";
import {useState} from "react";
import PersonalityTrait from "components/results/personality/trait/details";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityTraitList({setElement, ...props}) {
  const {assessment, getOption, isReady, translate, ui} = props;
  const [showMore, setShowMore] = useState(false);
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityTraits.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTraits.updated", {props, state}); });

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityTraits")) { return null; }
  if(!isReady("results")) { return null; }

  const allowHeaders = getOption("allowHeaders");
  const text = translate(showMore ? "show_less" : "show_more");
  let traits = assessment.personality_traits;

  if(!showMore) { traits = traits.slice(0, 5); }

  return (
    <div className={style.container} ref={setElement}>
      {allowHeaders && (
        <>
          <div className={style.sectionHeading}>{translate("personality_traits")}</div>
          <div className={style.p}>{translate("personality_traits_description")}</div>
        </>
      )}
      {traits.map((trait) => (
        <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...props} />
      ))}
      <div className={style.center}>
        <button className={style.toggle} onClick={() => setShowMore(!showMore)} type="button">{text}</button>
      </div>
    </div>
  );
}

PersonalityTraitList.defaultProps = {assessment: null};
PersonalityTraitList.propTypes = {
  assessment: PropTypes.shape({
    personality_traits: PropTypes.arrayOf(
      PropTypes.shape({
        personality_trait: PropTypes.shape({
          definition: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          personality_type: PropTypes.shape({
            badge: PropTypes.shape({
              color_1: PropTypes.string.isRequired,
              image_medium: PropTypes.string.isRequired
            }),
            name: PropTypes.string.isRequired
          })
        }).isRequired
      }).isRequired
    )
  }),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityTraitList as Component};
export default withTraitify(PersonalityTraitList);
