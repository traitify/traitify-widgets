/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import {getDetail} from "lib/helpers/details";
import {times} from "lib/helpers/array";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const getData = ({personality, perspective}) => {
  const data = {
    badge: {},
    description: personality.description,
    name: personality.name.split("/").map((name) => name.trim()).join(" | "),
    video: {}
  };

  if(personality.personality_type_1) {
    data.headingKey = "personality_blend_heading";

    times(2).forEach((_index) => {
      const index = _index + 1;
      const type = personality[`personality_type_${index}`];
      const url = getDetail({name: "Paradox - Badge", personality: type});

      if(url) { data.badge[`image_${index}`] = {alt: type.name, url}; }
    });
  } else {
    data.headingKey = "personality_base_heading";

    const url = getDetail({name: "Paradox - Badge", personality});
    if(url) { data.badge = {alt: personality.name, url}; }
  }

  data.video.url = getDetail({name: "Paradox - Video", personality});
  if(data.video.url) {
    data.video.thumbnail = getDetail({name: "Paradox - Video - Thumbnail", personality});
    data.video.track = getDetail({name: "Paradox - Video - Text Track", personality});
  }

  if(perspective === "thirdPerson") { data.headingKey += "_third_person"; }

  return data;
};

function PersonalityBaseHeading({setElement, ...props}) {
  const {assessment, getOption, personality: _personality, translate, ui} = props;
  const [data, setData] = useState(null);
  const personality = _personality || dig(assessment, "personality_blend")
    || dig(assessment, "personality_types", 0, "personality_type");
  const state = {personality};

  useDidMount(() => { ui.trigger("PersonalityBaseHeading.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityBaseHeading.updated", {props, state}); });
  useEffect(() => {
    if(!personality) { return; }

    setData(getData({personality, perspective: getOption("perspective")}));
  }, [personality]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityHeading")) { return null; }
  if(!data) { return null; }
  if(!personality) { return null; }

  const {
    badge,
    description,
    headingKey,
    name,
    video
  } = data;

  return (
    <div className={style.container} ref={setElement}>
      <div className={style.details}>
        <div className={style.header}>
          {badge.url && (
            <div className={style.badge}>
              <img alt={badge.image_1.alt} src={badge.image_1.url} />
            </div>
          )}
          {badge.image_1.url && (
            <div className={style.badge}>
              <img alt={badge.image_1.alt} src={badge.image_1.url} />
              <div className={style.badgeDivider} />
              <img alt={badge.image_2.alt} src={badge.image_2.url} />
            </div>
          )}
          <DangerousHTML
            className={style.heading}
            html={translate(headingKey, {personality: `<span>${name}</span>`})}
          />
        </div>
        {description && <div className={style.p}>{description}</div>}
      </div>
      {video.url && (
        <div className={style.meaning}>
          <video controls={true} playsInline={true} poster={video.thumbnail} crossOrigin="anonymous">
            <source src={video.url} type="video/mp4" />
            {video.track && <track kind="captions" src={video.track} />}
          </video>
        </div>
      )}
    </div>
  );
}

const personalityPropType = PropTypes.shape({
  details: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
});

PersonalityBaseHeading.defaultProps = {assessment: null, personality: null};
PersonalityBaseHeading.propTypes = {
  assessment: PropTypes.shape({
    personality_blend: personalityPropType,
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({personality_type: personalityPropType.isRequired})
    )
  }),
  getOption: PropTypes.func.isRequired,
  personality: personalityPropType,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityBaseHeading as Component};
export default withTraitify(PersonalityBaseHeading);
