import {
  faChartBar,
  faCheckSquare,
  faDollarSign,
  faGraduationCap,
  faLeaf,
  faLightbulb,
  faSquare,
  faCircleQuestion
} from "@fortawesome/free-solid-svg-icons";
import DangerousHTML from "lib/helpers/dangerous-html";
import HighChart from "components/highchart";
import Icon from "lib/helpers/icon";
import {useState} from "react";
import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalInfo({assessment, translate, career}) {
  const [showLegend, setShowLegend] = useState(false);

  let salary = career.salary_projection && career.salary_projection.annual_salary_mean;
  salary = salary && `$${Math.round(salary)}`;
  let growth = career.employment_projection && career.employment_projection.percent_growth_2022;
  growth = growth && `${growth}%`;

  const careerTraitIDs = career.personality_traits.map((trait) => trait.personality_trait?.id);
  const careerTraits = career.personality_traits.map((trait, index) => ({
    description: trait.personality_trait?.definition || `Trait ${index + 1}`,
    name: trait.personality_trait?.name || `Trait ${index + 1}`,
    y: trait.weight
  }));

  const assessmentTraits = assessment.personality_traits
    .filter((trait) => careerTraitIDs.includes(trait.personality_trait?.id))
    .map((trait, index) => ({
      description: trait.personality_trait?.definition || `Trait ${index + 1}`,
      name: trait.personality_trait?.name || `Trait ${index + 1}`,
      y: Math.round((trait.score + 100) / 2)
    }));

  const toggleLegend = () => { setShowLegend(!showLegend); };

  return (
    <div>
      <div className={style.contentTop}>
        <ul className={style.info}>
          <li>
            <h4>{translate("salary_mean")}:</h4>
            <div className={`${style.infoText} ${style.salary}`}>{salary}</div>
          </li>
          <li>
            <h4>{translate("local_salary")}:</h4>
          </li>
          <li>
            <h4>{translate("employment_growth")}:</h4>
            <div className={`${style.infoText} ${style.growth}`}>{growth}</div>
          </li>
        </ul>
        <ul className={style.info}>
          <li>
            <h4>{translate("education")}:</h4>
            <div className={`${style.infoText} ${style.education}`}>
              {translate(`experience_level_${career.experience_level.id}`)}
            </div>
          </li>
          <li>
            <h4>{translate("bright_future")}:</h4>
            <div className={style.infoText}>
              <input aria-label={translate("bright_future")} checked={career.bright_outlooks.length > 0} className={style.check} disabled={true} type="checkbox" readOnly={true} />
              <Icon icon={career.bright_outlooks.length > 0 ? faCheckSquare : faSquare} />
            </div>
          </li>
          <li>
            <h4>{translate("green_career")}:</h4>
            <div className={style.infoText}>
              <input aria-label={translate("green_career")} checked={career.green_categories.length > 0} className={style.check} disabled={true} type="checkbox" readOnly={true} />
              <Icon icon={career.green_categories.length > 0 ? faCheckSquare : faSquare} />
            </div>
          </li>
        </ul>
        <div className={style.careerHelp}>
          <a className={style.btnPrimary} href={`http://www.onetonline.org/link/summary/${career.id}`} target="_blank" rel="noopener noreferrer" title={translate("view_on_onet")}>{translate("view_on_onet")}</a>
          <button className={style.legendToggle} onClick={toggleLegend} title={translate("more_information")} type="button">
            <Icon className={style.questionBtn} icon={faCircleQuestion} />
          </button>
        </div>
        {showLegend && (
          <div className={style.legend}>
            <ul className={style.info}>
              <li>
                <h4><Icon icon={faDollarSign} /> {translate("salary_mean")}:</h4>
                <DangerousHTML html={translate("salary_mean_html")} tag="p" />
              </li>
              <li>
                <h4><Icon icon={faChartBar} /> {translate("employment_growth")}:</h4>
                <DangerousHTML html={translate("employment_growth_html")} tag="p" />
              </li>
              <li>
                <h4><Icon icon={faGraduationCap} /> {translate("education")}:</h4>
                <DangerousHTML html={translate("education_html")} tag="p" />
              </li>
            </ul>
            <ul className={style.info}>
              <li>
                <h4><Icon icon={faLightbulb} /> {translate("bright_future")}:</h4>
                <DangerousHTML html={translate("bright_future_html")} tag="p" />
              </li>
              <li>
                <h4><Icon icon={faLeaf} /> {translate("green_career")}:</h4>
                <DangerousHTML html={translate("green_career_html")} tag="p" />
              </li>
            </ul>
            <p className={style.center}>
              <button className={style.legendToggle} onClick={toggleLegend} title={translate("close")} type="button">{translate("close")}</button>
            </p>
          </div>
        )}
      </div>
      <hr className={style.grayDivider} />
      <div className={style.contentBottom}>
        <div className={style.leftContainer}>
          <div className={style.experienceContainer}>
            <h3 className={style.subtitleFull}>{`${translate("education_level")}:`}</h3>
            <ol className={style.experience}>
              {[1, 2, 3, 4, 5].map((level) => (
                <li key={level} className={career.experience_level.id >= level ? style.active : ""} />
              ))}
            </ol>
          </div>
          <div>{career.experience_level.experience}</div>
        </div>
        <div className={style.rightContainer}>
          <div>
            <h3 className={style.subtitleFull}>
              {`${translate("match_rate")}:`}
              <i className={style.matchRatePercent}>{Math.round(career.score)}%</i>
            </h3>
            <div className={style.matchRate}>
              <span data-match-rate={`${career.score}%`} style={{width: `${career.score}%`}} />
            </div>
          </div>
          <div className={style.chartContainer}>
            <HighChart
              xAxis={{type: "category"}}
              chart={{type: "area", polar: true, height: "300px"}}
              legend={{layout: "vertical", align: "center", verticalAlign: "top", width: 300, itemStyle: {width: 200}, marginTop: 0, marginBottom: 0}}
              series={[{
                name: `${career.title} Traits`,
                data: careerTraits.sort((a, b) => ((a.name > b.name) ? 1 : -1))
              }, {
                name: "Your Traits",
                data: assessmentTraits.sort((a, b) => ((a.name > b.name) ? 1 : -1))
              }]}
            />
            <span style={{width: "100%"}} />
          </div>
        </div>
      </div>
    </div>
  );
}

CareerModalInfo.propTypes = {
  assessment: PropTypes.shape({
    personality_traits: PropTypes.arrayOf(
      PropTypes.shape({
        personality_trait: PropTypes.shape({
          definition: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        }).isRequired,
        score: PropTypes.number.isRequired
      })
    )
  }).isRequired,
  career: PropTypes.shape({
    bright_outlooks: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    employment_projection: PropTypes.shape({
      percent_growth_2022: PropTypes.number.isRequired
    }).isRequired,
    experience_level: PropTypes.shape({
      experience: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    }).isRequired,
    green_categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    personality_traits: PropTypes.arrayOf(
      PropTypes.shape({
        personality_trait: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          definition: PropTypes.string.isRequired
        }).isRequired,
        weight: PropTypes.number.isRequired
      }).isRequired
    ),
    picture: PropTypes.string.isRequired,
    salary_projection: PropTypes.shape({annual_salary_mean: PropTypes.number}),
    score: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  translate: PropTypes.func.isRequired
};

export default CareerModalInfo;
