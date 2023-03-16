import PropTypes from "prop-types";
import {useLayoutEffect, useRef, useState} from "react";
import Content from "./content";
import style from "./style.scss";

function Carousel({recordWidth, ...props}) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const calculateCount = () => {
      const buttonWidth = 44;
      const {offsetLeft, offsetWidth: width} = ref.current;
      const {offsetWidth: parentWidth} = ref.current.offsetParent;
      const widthEstimate = parentWidth - offsetLeft;
      const containerWidth = width >= widthEstimate ? width : Math.floor(widthEstimate);

      setCount(Math.floor((containerWidth - (buttonWidth * 2)) / recordWidth));
    };
    calculateCount();

    window.addEventListener("resize", calculateCount);

    return () => window.removeEventListener("resize", calculateCount);
  }, []);

  return (
    <div className={style.carousel} ref={ref}>
      <Content count={count} {...props} />
    </div>
  );
}

Carousel.defaultProps = {recordWidth: 180};
Carousel.propTypes = {recordWidth: PropTypes.number};

export default Carousel;
