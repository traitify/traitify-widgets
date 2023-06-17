import PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import useComponentEvents from "lib/hooks/use-component-events";
import useTranslate from "lib/hooks/use-translate";
import {careerModalShowState, currentCareerIDState} from "lib/recoil";
import Jobs from "./jobs";
import style from "./style.scss";

function CareerDetails({career}) {
  const setCareerID = useSetRecoilState(currentCareerIDState);
  const setShow = useSetRecoilState(careerModalShowState);
  const translate = useTranslate();

  useComponentEvents("Career", {career});

  const openModal = () => {
    setCareerID(career.id);
    setShow(true);
  };

  return (
    <div className={style.container}>
      <div className={style.careerContainer}>
        <img alt={career.title} src={career.picture} />
        <div className={style.careerDetails}>
          <div className={style.title}>{career.title}</div>
          <div className={style.description}>{career.description}</div>
        </div>
      </div>
      <hr className={style.grayDivider} />
      <div className={style.content}>
        <div className={style.statsContainer}>
          <div className={style.upperBox}>
            <div className={style.innerContent}>
              <h3 className={style.subtitle}>
                {translate("match_rate")}:
                <i className={style.matchRatePercent}>{Math.round(career.score)}%</i>
              </h3>
              <div className={style.matchRate}>
                <span data-match-rate={`${career.score}%`} style={{width: `${career.score}%`}} />
              </div>
            </div>
            <div className={style.innerContent}>
              <div>
                <h3 className={style.subtitleFull}>{translate("education_level")}:</h3>
                <ol className={style.experience}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <li key={level} className={career.experience_level.id >= level ? style.active : ""} />
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className={style.lowerBox}>
            <div className={style.innerContent}>
              <div className={style.education}>
                <h3 className={style.subtitleFull}>{translate("education")}:</h3>
                <h3 className={style.subtitleFull}>
                  {translate(`experience_level_${career.experience_level.id}`)}
                </h3>
              </div>
            </div>
            <div className={style.learnMore}>
              <button type="button" onClick={openModal}>Learn More</button>
            </div>
          </div>
          <Jobs career={career} />
        </div>
      </div>
    </div>
  );
}

CareerDetails.propTypes = {
  career: PropTypes.shape({
    description: PropTypes.string.isRequired,
    experience_level: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    id: PropTypes.string.isRequired,
    inline_jobs: PropTypes.bool,
    jobs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        company: PropTypes.string,
        location: PropTypes.string,
        url: PropTypes.string
      })
    ),
    picture: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
};

export default CareerDetails;
