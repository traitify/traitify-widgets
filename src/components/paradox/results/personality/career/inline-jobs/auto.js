import PropTypes from "prop-types";
import {useLayoutEffect, useRef, useState} from "react";
import InlineJobs from "./index";
import style from "./style.scss";

function InlineJobsAuto({jobs, jobSource, translate}) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const configureCount = () => {
      const inlineJobWidth = 180;
      const nextButtonSize = 44;
      const {offsetLeft, offsetWidth: width} = ref.current;
      const {offsetWidth: parentWidth} = ref.current.offsetParent;
      const widthEstimate = parentWidth - offsetLeft;
      const difference = widthEstimate - width;

      const value = difference <= 0 ? Math.floor(parentWidth - offsetLeft) : width;

      const newCount = Math.floor((value - (nextButtonSize * 2)) / inlineJobWidth);
      setCount(newCount);
    };
    configureCount();

    window.addEventListener("resize", configureCount);

    return () => window.removeEventListener("resize", configureCount);
  }, []);

  return (
    <div className={style.auto} ref={ref}>
      <InlineJobs
        className={style.inlineJobsBase}
        count={count}
        jobs={jobs}
        jobSource={jobSource}
        translate={translate}
      />
    </div>
  );
}
export default InlineJobsAuto;

InlineJobsAuto.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      company: PropTypes.string,
      location: PropTypes.string,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  jobSource: PropTypes.string,
  translate: PropTypes.func.isRequired
};
InlineJobsAuto.defaultProps = {
  jobSource: "Indeed"
};
