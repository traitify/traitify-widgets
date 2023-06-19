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
      <div className={style.details}>
        <img alt={career.title} src={career.picture} />
        <div>
          <div className={style.title}>{career.title}</div>
          <div className={style.description}>{career.description}</div>
        </div>
      </div>
      <hr className={style.divider} />
      <div className={style.grid}>
        <div className={`${style.detail} ${style.match}`}>
          <div className={style.matchText}>
            <span className={style.subtitle}>{translate("match_rate")}:</span>
            {Math.round(career.score)}%
          </div>
          <div className={style.matchRate}>
            <span data-match-rate={`${career.score}%`} style={{width: `${career.score}%`}} />
          </div>
        </div>
        <div className={`${style.detail} ${style.experience}`}>
          <div className={style.subtitle}>{translate("education_level")}:</div>
          <div>
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className={`${style.level} ${career.experience_level.id >= level ? style.active : ""}`} />
            ))}
          </div>
        </div>
        <div className={style.detail}>
          <div className={style.subtitle}>{translate("education")}:</div>
          <div className={style.subtitle}>
            {translate(`experience_level_${career.experience_level.id}`)}
          </div>
        </div>
        <div className={style.learnMore}>
          <button type="button" onClick={openModal}>Learn More</button>
        </div>
      </div>
      <Jobs career={career} />
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
