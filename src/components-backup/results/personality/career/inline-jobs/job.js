import PropTypes from "prop-types";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import Icon from "lib/helpers/icon";
import DangerousHTML from "lib/helpers/dangerous-html";
import style from "./style.scss";

function InlineJob({job, jobSource, jobSourceURL, translate}) {
  if(!job) {
    return (
      <div className={`${style.inlineJob} ${style.empty}`}>
        <div>
          <DangerousHTML html={translate("no_jobs", {job_source: jobSource})} />
        </div>
        <div>
          <a
            className={style.discoverJobsButton}
            href={jobSourceURL[jobSource]}
          >
            {translate("discover_jobs")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={style.inlineJob}>
      <div>
        <div className={style.title}>{job.title}</div>
        {job.company && <div className={style.company}>{job.company}</div>}
        {job.location && (
          <div className={style.location}>
            <Icon className={style.jobIcon} icon={faLocationDot} />
            {job.location}
          </div>
        )}
      </div>
      {job.url && (
        <div>
          <a className={style.applyNowButton} href={job.url}>
            {translate("apply_now")}
          </a>
        </div>
      )}
    </div>
  );
}

InlineJob.defaultProps = {
  job: null,
  jobSource: "Indeed"
};
InlineJob.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string,
    company: PropTypes.string,
    location: PropTypes.string,
    url: PropTypes.string
  }),
  jobSource: PropTypes.string,
  jobSourceURL: PropTypes.shape({
    Indeed: PropTypes.string,
    Monster: PropTypes.string,
    MyNextMove: PropTypes.string
  }).isRequired,
  translate: PropTypes.func.isRequired
};

export default InlineJob;
