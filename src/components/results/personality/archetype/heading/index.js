/* eslint-disable jsx-a11y/media-has-caption */
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
  const video = personality.details.find(({title}) => title === "Video");
  const videoThumbnail = personality.details.find(({title}) => title === "Video - Thumbnail");
  const videoTrack = personality.details.find(({title}) => title === "Video - Text Track");
  let description;
  let headingKey;

  if(getOption("perspective") === "thirdPerson") {
    description = personality.details.find(({title}) => title === "Hiring Manager Description");
    headingKey = "personality_heading_third_person";
  } else {
    description = personality.details.find(({title}) => title === "Candidate Description");
    headingKey = "personality_heading";
  }

  return (
    <div className={style.container}>
      <div className={style.details}>
        <div>
          {badge && <img alt={personality.name} src={badge.body} />}
          <DangerousHTML
            html={translate(headingKey, {
              deck_name: deck.name,
              personality: `<span>${personality.name}</span>`
            })}
            tag="h2"
          />
        </div>
        <p>{description.body}</p>
      </div>
      <div className={style.meaning}>
        {video ? (
          <video controls={true} playsInline={true} poster={videoThumbnail && videoThumbnail.body} crossOrigin="anonymous">
            <source src={video.body} type="video/mp4" />
            {videoTrack && <track kind="captions" src={videoTrack.body} />}
          </video>
        ) : (
          <DangerousHTML html={translate("archetype_description_html")} tag="p" />
        )}
      </div>
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
