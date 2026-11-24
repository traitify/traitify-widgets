import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import useAssessment from "lib/hooks/use-assessment";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Slide({orientation, slide}) {
  const assessment = useAssessment({surveyType: "personality"});
  const caption = useRef(null);
  const textSurvey = assessment.slide_type?.toLowerCase() === "text";
  const translate = useTranslate();
  const captionKey = `survey.personality.${assessment.deck_id}.slides.${slide.id}.caption`;

  useLayoutEffect(() => {
    if(!caption.current) { return; }
    if(orientation !== "middle") { return; }

    caption.current.focus({preventScroll: true});
  }, [orientation]);

  return (
    <div aria-hidden={orientation !== "middle"} className={[style.slide, style[orientation], style[textSurvey ? "text" : "image"]].join(" ")}>
      {textSurvey ? (
        <span ref={caption}>{translate(captionKey, null, {fallback: false}) || slide.caption}</span>
      ) : (
        <img alt={slide.alternative_text} src={slide.image} />
      )}
    </div>
  );
}

Slide.propTypes = {
  orientation: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    alternative_text: PropTypes.string,
    caption: PropTypes.string,
    id: PropTypes.string.isRequired,
    image: PropTypes.string
  }).isRequired
};

export default Slide;
