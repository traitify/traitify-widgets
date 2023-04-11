/* eslint-disable jsx-a11y/media-has-caption */
import {faBriefcase} from "@fortawesome/free-solid-svg-icons";
import DangerousHTML from "components/common/dangerous-html";
import Icon from "components/common/icon";
import dig from "lib/common/object/dig";
import useAssessment from "lib/hooks/use-assessment";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useInlineMemo from "lib/hooks/use-inline-memo";
import useOption from "lib/hooks/use-option";
import usePersonality from "lib/hooks/use-personality";
import useTranslate from "lib/hooks/use-translate";
import useBaseData from "./use-base-data";
import style from "./style.scss";

export default function PersonalityBaseHeading() {
  const assessment = useAssessment();
  const careersLink = useInlineMemo((deckID, link) => (
    deckID?.includes("career") && link
  ), [dig(assessment, "deck_id"), useOption("careersLink")]);
  const data = useBaseData();
  const disabled = useDisabledComponent("PersonalityHeading");
  const personality = usePersonality();
  const translate = useTranslate();

  useComponentEvents("PersonalityBaseHeading", {personality});

  if(disabled) { return null; }
  if(!data) { return null; }

  const {
    badge,
    description,
    headingKey,
    name,
    perspective,
    video
  } = data;

  return (
    <div className={style.container}>
      <div className={style.row}>
        <div className={style.details}>
          <div className={style.header}>
            {badge.url && (
              <div className={style.badge}>
                <img alt={badge.alt} src={badge.url} />
              </div>
            )}
            {badge.image_1 && (
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
      {careersLink && (
        <div className={style.careersLink}>
          <div>{translate(`careers_link_heading${perspective === "thirdPerson" ? "_third_person" : ""}`)}</div>
          <a href={careersLink}><Icon icon={faBriefcase} /> {translate("career_matches")}</a>
        </div>
      )}
    </div>
  );
}
