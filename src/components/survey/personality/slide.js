import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import useAssessment from "lib/hooks/use-assessment";
import style from "./style.scss";

function Slide({orientation, slide}) {
  const assessment = useAssessment({surveyType: "personality"});
  const caption = useRef(null);
  const textSurvey = assessment.slide_type?.toLowerCase() === "text";

  useLayoutEffect(() => {
    if(!caption.current) { return; }
    if(orientation !== "middle") { return; }

    caption.current.focus({preventScroll: true});
  }, [orientation]);

  return (
    <div className={[style.slide, style[orientation], style[textSurvey ? "text" : "image"]].join(" ")}>
      {textSurvey ? (
        <span ref={caption}>{slide.caption}</span>
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
    image: PropTypes.string
  }).isRequired
};

export default Slide;
