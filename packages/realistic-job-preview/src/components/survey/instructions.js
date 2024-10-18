/* eslint-disable jsx-a11y/media-has-caption, no-alert */
import PropTypes from "prop-types";
import {useState} from "react";
import Markdown from "traitify/components/common/markdown";
import useAssessment from "lib/hooks/use-assessment";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const videoProps = {
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  playsInline: true
};

function Instructions({onStart}) {
  const assessment = useAssessment();
  const translate = useTranslate();
  const [ready, setReady] = useState(false);
  const onPlay = () => setReady(true);

  return (
    <div className={style.container}>
      <div className={style.h1}>{translate("rjp.instructions.heading") || "Realistic Job Preview Instructions"}</div>
      <Markdown className={style.text}>{assessment.instructions}</Markdown>
      {assessment.rjpVideoUrls.map(({thumbnailUrl, videoUrl}) => (
        <video
          key={videoUrl}
          onError={onPlay}
          onPlay={onPlay}
          poster={thumbnailUrl}
          {...videoProps}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ))}
      {ready && (
        <div className={style.secondaryInstructions}>
          <div className={style.h2}>{translate("rjp.instructions.secondary.heading") || "Ready to start the preview?"}</div>
          <div className={style.p}>{translate("rjp.instructions.secondary.content") || "You will be given questions based on the video you just watched. Read each question and select which answer that best suits you."}</div>
          <button className={`traitify--response-button ${style.btn}`} onClick={onStart} type="button">{translate("rjp.instructions.button") || "Let's Go!"}</button>
        </div>
      )}
    </div>
  );
}

Instructions.propTypes = {onStart: PropTypes.func.isRequired};

export default Instructions;
