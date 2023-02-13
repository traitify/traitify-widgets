import DangerousHTML from "components/common/dangerous-html";
import useDeck from "lib/hooks/use-deck";
import useDisabledComponents from "lib/hooks/use-disabled-components";
import useTranslate from "lib/hooks/use-translate";
import useArchetypeDetails from "./use-archetype-details";
import style from "./style.scss";

export default function PersonalityArchetypeHeading() {
  const details = useArchetypeDetails();
  const deck = useDeck();
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
