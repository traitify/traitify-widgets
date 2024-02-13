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
import {useState} from "react";
import DangerousHTML from "components/common/dangerous-html";
import Icon from "components/common/icon";
import useCareer from "lib/hooks/use-career";
import useTranslate from "lib/hooks/use-translate";
import Chart from "./chart";
import style from "./style.scss";

export default function CareerModalDetails() {
  const career = useCareer();
  const translate = useTranslate();
  const [showLegend, setShowLegend] = useState(false);

  if(!career) { return null; }

  let salary = career.salary_projection && career.salary_projection.annual_salary_mean;
  salary = salary && `$${Math.round(salary)}`;
  let growth = career.employment_projection && career.employment_projection.percent_growth_2022;
  growth = growth && `${growth}%`;
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
            <Icon alt={translate("more_information")} className={style.questionBtn} icon={faCircleQuestion} />
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
          <Chart />
        </div>
      </div>
    </div>
  );
}
