import PropTypes from "prop-types";
import {
  faBuilding,
  faLocationDot,
  faSuitcase
} from "@fortawesome/free-solid-svg-icons";
import Icon from "lib/helpers/icon";
import style from "./style.scss";

function Jobs({jobs, translate}) {
  return (
    <div className={style.list}>
      {jobs.map((job) => (
        <div className={style.listItem} key={job.id}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <Icon className={style.jobTitleIcon} icon={faSuitcase} />
              <div>
                <div className={style.title}>
                  {job.title}
                </div>
                <div className={style.description}>
                  <Icon className={style.jobIcon} icon={faBuilding} />
                  {job.company}
                </div>
                <div className={style.description}>
                  <Icon className={style.jobIcon} icon={faLocationDot} />
                  {job.location}
                </div>
              </div>
            </div>
            <div>
              <a className={style.applyNowButton} href={job.url}>
                {translate("apply_now")}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
Jobs.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  translate: PropTypes.func.isRequired
};
export default Jobs;
