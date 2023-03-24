import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Job({record}) {
  const translate = useTranslate();

  return (
    <div className={style.job}>
      <div>
        <div className={style.title}>{record.title}</div>
        {record.company && <div className={style.company}>{record.company}</div>}
        {record.location && (
          <div className={style.location}>
            <Icon className={style.jobIcon} icon={faLocationDot} />
            {record.location}
          </div>
        )}
      </div>
      {record.url && (
        <div>
          <a className={style.applyNowButton} href={record.url}>
            {translate("apply_now")}
          </a>
        </div>
      )}
    </div>
  );
}

Job.propTypes = {
  record: PropTypes.shape({
    company: PropTypes.string,
    location: PropTypes.string,
    title: PropTypes.string.isRequired,
    url: PropTypes.string
  }).isRequired
};

export default Job;
