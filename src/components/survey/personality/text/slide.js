import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import style from "../style.scss";

function Slide({orientation, slide}) {
  const caption = useRef(null);

  useLayoutEffect(() => {
    if(!caption.current) { return; }
    if(orientation === "middle") { return; }

    caption.current.focus({preventScroll: true});
  }, [orientation]);

  return (
    <div className={`${style.slide} ${style[orientation]}`}>
      <div className={style.text}>{slide.text}</div>
    </div>
  );
}

Slide.propTypes = {
  orientation: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired
};

export default Slide;
