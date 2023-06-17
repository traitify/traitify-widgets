/* eslint-disable react/no-array-index-key */
import {
  faBuilding,
  faLocationDot,
  faSuitcase
} from "@fortawesome/free-solid-svg-icons";
import DangerousHTML from "components/common/dangerous-html";
import Icon from "components/common/icon";
import {useRecoilValue} from "recoil";
import {modalJobsState} from "lib/recoil";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const jobSources = {
  Indeed: "https://www.indeed.com",
  Monster: "https://www.monster.com",
  MyNextMove: "https://www.mynextmove.org"
};

export default function CareerModalJobs() {
  const {source: _source} = useOption("career")?.jobs || {};
  const source = Object.hasOwn(jobSources, _source) ? _source : "Indeed";
  const {fetching, records} = useRecoilValue(modalJobsState);
  const translate = useTranslate();

  if(fetching) { return <div className={style.list}>{translate("loading")}</div>; }
  if(records.length === 0) {
    return (
      <div className={style.list}>
        <DangerousHTML html={translate("no_jobs", {job_source: source})} />
        <div>
          <a className={style.discoverJobsButton} href={jobSources[source]}>
            {translate("discover_jobs")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={style.list}>
      {records.map((record, index) => (
        <div className={style.listItem} key={index}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <Icon className={style.jobTitleIcon} icon={faSuitcase} />
              <div>
                <div className={style.title}>
                  {record.title}
                </div>
                {record.company && (
                  <div className={style.description}>
                    <Icon className={style.jobIcon} icon={faBuilding} />
                    {record.company}
                  </div>
                )}
                {record.location && (
                  <div className={style.description}>
                    <Icon className={style.jobIcon} icon={faLocationDot} />
                    {record.location}
                  </div>
                )}
              </div>
            </div>
            {record.url && (
              <div>
                <a className={style.applyNowButton} href={record.url}>
                  {translate("apply_now")}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
