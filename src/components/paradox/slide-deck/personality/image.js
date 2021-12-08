import PropTypes from "prop-types";
import style from "./style.scss";

function Image({orientation, slide}) {
  return (
    <div className={`${style.slide} ${style[orientation]}`}>
      <img src={slide.image} alt={slide.alternative_text} />
    </div>
  );
}

Image.propTypes = {
  orientation: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    alternative_text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
};

export default Image;
