import PropTypes from "prop-types";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import Icon from "lib/helpers/icon";
import DangerousHTML from "lib/helpers/dangerous-html";
import style from "./style.scss";

function InlineJob({job, jobSource = "Indeed", translate}) {
  const jobSourceURL = {
    Indeed: "https://www.indeed.com/",
    Monster: "https://www.monster.com",
    MyNextMove: "https://www.mynextmove.org"
  };

  if(!job || Object.keys(job).length === 0) {
    return (
      <div className={`${style.inlineJob} ${style.empty}`}>
        <div>
          <DangerousHTML html={translate("no_jobs", {job_source: jobSource || "Indeed"})} />
        </div>
        <div>
          <a
            className={style.discoverJobsButton}
            href={jobSourceURL[jobSource] || jobSourceURL.Indeed}
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
      <div>
        <a className={style.applyNowButton} href={job.url}>
          {translate("apply_now")}
        </a>
      </div>
    </div>
  );
}
export default InlineJob;

InlineJob.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string,
    company: PropTypes.string,
    location: PropTypes.string,
    url: PropTypes.string
  }),
  jobSource: PropTypes.string,
  translate: PropTypes.func.isRequired
};
InlineJob.defaultProps = {
  job: {},
  jobSource: "Indeed"
};
