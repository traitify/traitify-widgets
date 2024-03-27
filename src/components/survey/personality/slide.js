import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import useAssessment from "lib/hooks/use-assessment";
import style from "./style.scss";

function Slide({orientation, slide}) {
  const assessment = useAssessment({type: "personality"});
  const caption = useRef(null);
  const textSurvey = assessment.slide_type === "text";

  useLayoutEffect(() => {
    if(!caption.current) { return; }
    if(orientation === "middle") { return; }

    caption.current.focus({preventScroll: true});
  }, [orientation]);

  return (
    <div className={`${style.slide} ${style[orientation]}`}>
      {textSurvey ? (
        <div className={style.text} ref={caption}>{slide.text}</div>
      ) : (
        <img src={slide.image} alt={slide.alternative_text} />
      )}
    </div>
  );
}

Slide.propTypes = {
  orientation: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    alternative_text: PropTypes.string,
    image: PropTypes.string,
    text: PropTypes.string
  }).isRequired
};

export default Slide;
