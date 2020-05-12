import PropTypes from "prop-types";
import DangerousHTML from "lib/helpers/dangerous-html";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityArchetypeHeading(props) {
  const {assessment, deck, followDeck, getOption, isReady, translate, ui} = props;
  const personality = dig(assessment, ["archetype"]);
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityArchetype.initialized", {props, state}); });
  useDidMount(() => { followDeck(); });
  useDidUpdate(() => { ui.trigger("PersonalityArchetype.updated", {props, state}); });

  if(!isReady("results")) { return null; }
  if(!isReady("deck")) { return null; }
  if(!personality) { return null; }

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityArchetype")) { return null; }

  const badge = personality.details.find(({title}) => title === "Badge");
  const perspective = getOption("perspective");
  const description = (
    perspective === "thirdPerson"
      ? personality.details.find(({title}) => title === "Hiring Manager Description")
      : personality.details.find(({title}) => title === "Candidate Description")
  );

  return (
    <div className={style.container}>
      {perspective === "thirdPerson" ? (
        <div className={style.thirdPersonDetails}>
          <div className={description && style.badgeAndName}>
            {badge && <img alt={personality.name} src={badge.body} />}
            <DangerousHTML
              html={translate("personality_heading_third_person", {
                deck_name: deck.name,
                personality: `<br /><span>${personality.name}</span><br />`
              })}
              className={style.personalityHeading}
              tag="h2"
            />
          </div>
          {description && <span className={style.divider} />}
          {description && <span className={style.body}>{description.body}</span>}
        </div>
      ) : [
        <div key="heading" className={style.details}>
          {badge && <img alt={personality.name} src={badge.body} />}
          <DangerousHTML
            html={translate("personality_heading", {
              deck_name: deck.name,
              personality: `<span>${personality.name}</span>`
            })}
            tag="h2"
          />
          {description && <p>{description.body}</p>}
        </div>,
        <div key="meaning" className={style.meaning}>
          <DangerousHTML html={translate("candidate_description_for_archetype_html")} tag="p" />
        </div>
      ]}
    </div>
  );
}

PersonalityArchetypeHeading.defaultProps = {assessment: null, deck: null};
PersonalityArchetypeHeading.propTypes = {
  assessment: PropTypes.shape({archetype: PropTypes.object}),
  deck: PropTypes.shape({name: PropTypes.string.isRequired}),
  followDeck: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  options: PropTypes.shape({archetype: PropTypes.object}).isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityArchetypeHeading as Component};
export default withTraitify(PersonalityArchetypeHeading);
