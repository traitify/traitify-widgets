/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import DangerousHTML from "lib/helpers/dangerous-html";
import {getDetail} from "lib/helpers/details";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const getData = ({personality, perspective}) => {
  const data = {badge: {}, video: {}};

  if(perspective === "thirdPerson") {
    data.description = getDetail({name: "Hiring Manager Description", personality});
    data.headingKey = "personality_heading_third_person";
  } else {
    data.description = getDetail({name: "Candidate Description", personality});
    data.headingKey = "personality_heading";
  }

  data.badge.url = getDetail({name: "Paradox - Badge", personality});
  data.video.url = getDetail({name: "Paradox - Video", personality});
  if(data.video.url) {
    data.video.thumbnail = getDetail({name: "Paradox - Video - Thumbnail", personality});
    data.video.track = getDetail({name: "Paradox - Video - Text Track", personality});
  }

  if(data.badge.url && data.video.url) { return data; }

  data.fallback = true;
  data.badge.url = getDetail({name: "Badge", personality});
  data.video.url = getDetail({name: "Video", personality});
  if(data.video.url) {
    data.video.thumbnail = getDetail({name: "Video - Thumbnail", personality});
    data.video.track = getDetail({name: "Video - Text Track", personality});
  }

  return data;
};

function PersonalityArchetypeHeading({element, ...props}) {
  const {assessment, deck, followDeck, getOption, isReady, translate, ui} = props;
  const personality = dig(assessment, "archetype");
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityArchetype.initialized", {props, state}); });
  useDidMount(() => { followDeck(); });
  useDidUpdate(() => { ui.trigger("PersonalityArchetype.updated", {props, state}); });

  if(!isReady("results")) { return null; }
  if(!isReady("deck")) { return null; }
  if(!personality) { return null; }

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityArchetype")) { return null; }

  const {
    badge,
    description,
    fallback,
    headingKey,
    video
  } = getData({personality, perspective: getOption("perspective")});

  return (
    <div className={style.container} ref={element}>
      <div className={style.details}>
        <div>
          {badge.url && (
            <img
              alt={personality.name}
              className={fallback ? style.fallback : null}
              src={badge.url}
            />
          )}
          <DangerousHTML
            className={style.heading}
            html={translate(headingKey, {
              deck_name: deck.name,
              personality: `<span>${personality.name}</span>`
            })}
          />
        </div>
        {description && <div className={style.p}>{description}</div>}
      </div>
      <div className={style.meaning}>
        {video.url ? (
          <video controls={true} playsInline={true} poster={video.thumbnail} crossOrigin="anonymous">
            <source src={video.url} type="video/mp4" />
            {video.track && <track kind="captions" src={video.track} />}
          </video>
        ) : (
          <DangerousHTML html={translate("archetype_description_html")} tag="p" />
        )}
      </div>
    </div>
  );
}

PersonalityArchetypeHeading.defaultProps = {assessment: null, deck: null, element: null};
PersonalityArchetypeHeading.propTypes = {
  assessment: PropTypes.shape({
    archetype: PropTypes.shape({
      details: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        }).isRequired
      ).isRequired,
      name: PropTypes.string.isRequired
    })
  }),
  deck: PropTypes.shape({name: PropTypes.string.isRequired}),
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ]),
  followDeck: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityArchetypeHeading as Component};
export default withTraitify(PersonalityArchetypeHeading);
