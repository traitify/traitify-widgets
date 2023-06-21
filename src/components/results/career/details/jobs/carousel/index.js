import PropTypes from "prop-types";
import {useLayoutEffect, useRef, useState} from "react";
import Content from "./content";

const gap = 16;
const buttonWidth = 18; // Border * 2 + Padding * 2
const containerBuffer = 34; // Border * 2 + Padding * 2

function Carousel({recordWidth, ...props}) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const calculateCount = () => {
      const {offsetLeft, offsetWidth: width} = ref.current;
      const {offsetWidth: parentWidth} = ref.current.offsetParent;
      const widthEstimate = parentWidth - offsetLeft;
      const containerWidth = width >= widthEstimate ? Math.floor(widthEstimate) : width;
      const buttonSpace = buttonWidth * 2 + gap;
      const containerSpace = containerWidth - containerBuffer;
      const recordSpace = recordWidth + gap;
      const countEstimate = Math.floor((containerSpace - buttonSpace) / recordSpace);

      setCount(countEstimate === 0 ? 1 : countEstimate);
    };
    calculateCount();

    window.addEventListener("resize", calculateCount);

    return () => window.removeEventListener("resize", calculateCount);
  }, []);

  return (
    <div ref={ref}>
      <Content count={count} {...props} />
    </div>
  );
}

Carousel.defaultProps = {recordWidth: 180};
Carousel.propTypes = {recordWidth: PropTypes.number};

export default Carousel;
