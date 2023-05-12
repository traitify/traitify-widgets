/* eslint-disable react/no-array-index-key */
import {
  faBuilding,
  faLocationDot,
  faSuitcase
} from "@fortawesome/free-solid-svg-icons";
import Icon from "components/common/icon";
import useJobs from "lib/hooks/use-jobs";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function CareerModalJobs() {
  const {jobs} = useJobs();
  const translate = useTranslate();

  return (
    <div className={style.list}>
      {jobs?.map((job, index) => (
        <div className={style.listItem} key={index}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <Icon className={style.jobTitleIcon} icon={faSuitcase} />
              <div>
                <div className={style.title}>
                  {job.title}
                </div>
                {job.company && (
                  <div className={style.description}>
                    <Icon className={style.jobIcon} icon={faBuilding} />
                    {job.company}
                  </div>
                )}
                {job.location && (
                  <div className={style.description}>
                    <Icon className={style.jobIcon} icon={faLocationDot} />
                    {job.location}
                  </div>
                )}
              </div>
            </div>
            {job.url && (
              <div>
                <a className={style.applyNowButton} href={job.url}>
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
