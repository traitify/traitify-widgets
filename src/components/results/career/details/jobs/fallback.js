import PropTypes from "prop-types";
import DangerousHTML from "components/common/dangerous-html";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Fallback({jobSource}) {
  const translate = useTranslate();
  const jobSourceURL = {
    Indeed: "https://www.indeed.com/",
    Monster: "https://www.monster.com",
    MyNextMove: "https://www.mynextmove.org"
  };

  if(!(jobSource in jobSourceURL)) { return null; }

  return (
    <div className={`${style.job} ${style.empty}`}>
      <DangerousHTML html={translate("no_jobs", {job_source: jobSource})} />
      <div>
        <a className={style.discoverJobsButton} href={jobSourceURL[jobSource]}>
          {translate("discover_jobs")}
        </a>
      </div>
    </div>
  );
}

Fallback.propTypes = {jobSource: PropTypes.string.isRequired};

export default Fallback;
