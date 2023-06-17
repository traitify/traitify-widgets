import DangerousHTML from "components/common/dangerous-html";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const jobSources = {
  Indeed: "https://www.indeed.com",
  Monster: "https://www.monster.com",
  MyNextMove: "https://www.mynextmove.org"
};

export default function Fallback() {
  const {source: _source} = useOption("career")?.jobs || {};
  const source = Object.hasOwn(jobSources, _source) ? _source : "Indeed";
  const translate = useTranslate();

  return (
    <div className={`${style.job} ${style.empty}`}>
      <DangerousHTML html={translate("no_jobs", {job_source: source})} />
      <div>
        <a className={style.discoverJobsButton} href={jobSources[source]}>
          {translate("discover_jobs")}
        </a>
      </div>
    </div>
  );
}
