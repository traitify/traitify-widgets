import DangerousHTML from "components/common/dangerous-html";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Fallback() {
  const {source} = useOption("career")?.jobs || {};
  const translate = useTranslate();
  const jobSourceURL = {
    Indeed: "https://www.indeed.com/",
    Monster: "https://www.monster.com",
    MyNextMove: "https://www.mynextmove.org"
  };

  if(!(source in jobSourceURL)) { return null; }

  return (
    <div className={`${style.job} ${style.empty}`}>
      <DangerousHTML html={translate("no_jobs", {job_source: source})} />
      <div>
        <a className={style.discoverJobsButton} href={jobSourceURL[source]}>
          {translate("discover_jobs")}
        </a>
      </div>
    </div>
  );
}

export default Fallback;
