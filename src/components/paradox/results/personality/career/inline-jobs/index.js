import PropTypes from "prop-types";
import {faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import Icon from "lib/helpers/icon";
import {useEffect, useState} from "react";
import InlineJob from "./job";
import style from "./style.scss";

function CarouselButton({className, onClick, children, disabled}) {
  const [isDisabled, setIsDisabled] = useState(disabled);

  const handleClick = () => {
    if(isDisabled) { return; }
    onClick();
  };

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  return (
    <div
      className={`${className} ${isDisabled ? style.disabled : ""}`}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
}
CarouselButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

function InlineJobs({className, count, jobs, jobSource, translate}) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(count || 0);

  const handlePrev = () => {
    if(start - count <= 0) {
      setStart(0);
      setEnd(count);
    } else {
      setEnd(end - count);
      setStart(start - count);
    }
  };
  const handleNext = () => {
    if(end + count >= jobs.length - 1) {
      setStart(jobs.length - (count));
      setEnd(jobs.length);
    } else {
      setStart(end);
      setEnd(end + count);
    }
  };

  useEffect(() => {
    setStart(0);
    setEnd(count);
  }, [count]);

  if(jobs?.length === 0) {
    return (
      <div className={`${style.job} ${className}`}>
        <InlineJob job={{}} jobSource={jobSource} translate={translate} />
      </div>
    );
  }

  return (
    <div className={`${style.job} ${className}`}>
      <CarouselButton
        className={style.prevButton}
        disabled={start <= 0}
        onClick={handlePrev}
      >
        <Icon icon={faCaretLeft} />
      </CarouselButton>
      {jobs.slice(start, end).map((job) => (
        <div key={job.url}>
          <InlineJob job={job} jobSource={jobSource} translate={translate} />
        </div>
      ))}
      <CarouselButton
        className={style.nextButton}
        disabled={end >= jobs.length}
        onClick={handleNext}
      >
        <Icon icon={faCaretRight} />
      </CarouselButton>
    </div>
  );
}

InlineJobs.defaultProps = {
  className: "",
  count: 0,
  jobSource: "Indeed"
};
InlineJobs.propTypes = {
  className: PropTypes.string,
  count: PropTypes.number,
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

export default InlineJobs;
