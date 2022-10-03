import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import InlineJobs from "./index";
import style from "./style.scss";

function InlineJobsAuto({jobs, jobSource, translate}) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  /** Adjusts number of jobs based on screen size */
  const configureCount = () => {
    const INLINE_JOB_WIDTH = 180;
    const NEXT_BUTTON_SIZE = 44;
    const {offsetLeft: OFFSET_LEFT, offsetWidth: WIDTH} = ref.current;
    const {offsetWidth: PARENT_WIDTH} = ref.current.offsetParent;
    const WIDTH_ESTIMATE = PARENT_WIDTH - OFFSET_LEFT;
    const DIFFERENCE = WIDTH_ESTIMATE - WIDTH;

    const VALUE = DIFFERENCE <= 0 ? Math.floor(PARENT_WIDTH - OFFSET_LEFT) : WIDTH;

    const newCount = Math.floor((VALUE - (NEXT_BUTTON_SIZE * 2)) / INLINE_JOB_WIDTH);
    setCount(newCount);
  };

  useEffect(() => {
    configureCount();
  }, []);

  window.addEventListener("resize", configureCount);

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
