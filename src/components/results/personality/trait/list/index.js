import PropTypes from "prop-types";
import PersonalityTrait from "components/results/personality/trait/details";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityTraitList(props) {
  const {assessment, getOption, isReady, translate, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityTraits.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityTraits.updated", {props, state}); });

  if(!isReady("results")) { return null; }

  const perspective = getOption("perspective") || "firstPerson";
  const thirdPerson = perspective === "thirdPerson";
  const traits = assessment.personality_traits;

  return (
    <div className={style.traits}>
      <h4 className={style.title}>{translate("most_represented_traits")}</h4>
      {thirdPerson && (
        <div className={style.traitsDefinition}>{translate("most_represented_traits_definition")}</div>
      )}
      {traits.slice(0, 5).map((trait) => (
        <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...props} />
      ))}
      <h4 className={style.title}>{translate("least_represented_traits")}</h4>
      {thirdPerson && (
        <div className={style.traitsDefinition}>{translate("least_represented_traits_definition")}</div>
      )}
      {traits.slice(-5).map((trait) => (
        <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...props} />
      ))}
    </div>
  );
}

PersonalityTraitList.defaultProps = {assessment: null};
PersonalityTraitList.propTypes = {
  assessment: PropTypes.shape({personality_traits: PropTypes.array}),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityTraitList as Component};
export default withTraitify(PersonalityTraitList);
