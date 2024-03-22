/* eslint-disable jsx-a11y/media-has-caption */
import DangerousHTML from "components/common/dangerous-html";
import useComponentEvents from "lib/hooks/use-component-events";
import useDeck from "lib/hooks/use-deck";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";
import useArchetypeDetails from "./use-archetype-details";

export default function PersonalityArchetypeHeading() {
  const deck = useDeck();
  const details = useArchetypeDetails();
  const disabled = useDisabledComponent("PersonalityArchetype");
  const translate = useTranslate();

  useComponentEvents("PersonalityArchetype");

  if(disabled) { return null; }
  if(!deck) { return null; }
  if(!details) { return null; }

  const {
    badge,
    description,
    headingKey,
    personality,
    video
  } = details;

  return (
    <div className={style.container}>
      <div className={style.details}>
        <div>
          {badge.url && <img alt={personality.name} src={badge.url} />}
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
          <video controls={true} crossOrigin="anonymous" disablePictureInPicture={true} playsInline={true} poster={video.thumbnail}>
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
