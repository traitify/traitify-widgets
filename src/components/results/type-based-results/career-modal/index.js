import {
  faAdjust,
  faChartBar,
  faExternalLinkSquareAlt,
  faCheckSquare,
  faDollarSign,
  faGlobeAmericas,
  faGraduationCap,
  faInfoCircle,
  faLeaf,
  faLightbulb,
  faSquare,
  faTimes,
  faQuestion
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import HighChart from "components/highchart";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class CareerModal extends Component {
  static propTypes = {
    assessment: PropTypes.shape({
      personality_traits: PropTypes.array
    }),
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  static defaultProps = {assessment: null};
  constructor(props) {
    super(props);

    this.state = {
      career: null,
      show: false,
      showLegend: false
    };
  }
  componentDidMount() {
    this.props.ui.trigger("CareerModal.initialized", this);
    this.props.ui.on("CareerModal.career", this.setCareer);
    this.props.ui.on("CareerModal.hide", this.hide);
    this.props.ui.on("CareerModal.show", this.show);
  }
  componentDidUpdate() {
    this.props.ui.trigger("CareerModal.updated", this);
  }
  componentWillUnmount() {
    this.props.ui.off("CareerModal.career", this.setCareer);
    this.props.ui.off("CareerModal.hide", this.hide);
    this.props.ui.off("CareerModal.show", this.show);
  }
  close = () => { this.props.ui.trigger("CareerModal.hide", this); }
  hide = () => { this.setState({show: false}); }
  setCareer = () => { this.setState({career: this.props.ui.current["CareerModal.career"]}); }
  show = () => { this.setState({show: true}); }
  toggleLegend = () => { this.setState((state) => ({showLegend: !state.showLegend})); }
  render() {
    const {career, show, showLegend} = this.state;
    const {assessment, isReady, translate} = this.props;
    if(!show || !career) { return null; }
    if(!isReady("results")) { return null; }

    let salary = career.salary_projection && career.salary_projection.annual_salary_mean;
    salary = salary && `$${Math.round(salary)}`;
    let growth = career.employment_projection && career.employment_projection.percent_growth_2022;
    growth = growth && `${growth}%`;

    const careerTraitIDs = career.personality_traits.map((trait) => trait.personality_trait.id);
    const careerTraits = career.personality_traits.map((trait) => ({y: trait.weight, description: trait.personality_trait.definition, name: trait.personality_trait.name})); // eslint-disable-line max-len
    const assessmentTraits = assessment.personality_traits
      .filter((trait) => careerTraitIDs.includes(trait.personality_trait.id))
      .map((trait) => ({y: Math.round((trait.score + 100) / 2), description: trait.personality_trait.definition, name: trait.personality_trait.name})); // eslint-disable-line max-len

    return (
      <div className={`${style.modal} ${style.container}`} role="dialog">
        <section className={style.modalContainer}>
          <Icon aria-label={translate("close")} className={style.close} icon={faTimes} onClick={this.close} tabIndex="-1" />
          <div className={style.modalContent}>
            <img className={style.image} alt={career.title} src={career.picture} />
            <h2 className={style.title}>{career.title}</h2>
            <p className={style.description}>{career.description}</p>
            <hr />
            <h3 className={style.heading}><Icon icon={faInfoCircle} /> {translate("career_information")}:</h3>
            <ul className={style.info}>
              <li>
                <h4><Icon icon={faDollarSign} /> {translate("salary_mean")}:</h4>
                <div className={`${style.infoText} ${style.salary}`}>{salary}</div>
              </li>
              <li>
                <h4><Icon icon={faChartBar} /> {translate("employment_growth")}:</h4>
                <div className={`${style.infoText} ${style.growth}`}>{growth}</div>
              </li>
              <li>
                <h4><Icon icon={faGraduationCap} /> {translate("education")}:</h4>
                <div className={`${style.infoText} ${style.education}`}>{translate(`experience_level_${career.experience_level.id}`)}</div>
              </li>
            </ul>
            <ul className={style.info}>
              <li>
                <h4><Icon icon={faLightbulb} /> {translate("bright_future")}:</h4>
                <div className={style.infoText}>
                  <input aria-label={translate("bright_future")} checked={career.bright_outlooks.length > 0} className={style.check} disabled={true} type="checkbox" readOnly={true} />
                  <Icon icon={career.bright_outlooks.length > 0 ? faCheckSquare : faSquare} />
                </div>
              </li>
              <li>
                <h4><Icon icon={faLeaf} /> {translate("green_career")}:</h4>
                <div className={style.infoText}>
                  <input aria-label={translate("green_career")} checked={career.green_categories.length > 0} className={style.check} disabled={true} type="checkbox" readOnly={true} />
                  <Icon icon={career.green_categories.length > 0 ? faCheckSquare : faSquare} />
                </div>
              </li>
              <li>
                <div className={style.center}>
                  <button className={style.legendToggle} onClick={this.toggleLegend} title={translate("more_information")} type="button">
                    {translate("help")} <Icon icon={faQuestion} />
                  </button>
                </div>
              </li>
            </ul>
            <p className={style.center}>
              <a className={style.btnPrimary} href={`http://www.onetonline.org/link/summary/${career.id}`} target="_blank" rel="noopener noreferrer" title={translate("view_on_onet")}>{translate("view_on_onet")}</a>
            </p>
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
                  <button className={style.legendToggle} onClick={this.toggleLegend} title={translate("close")} type="button">{translate("close")}</button>
                </p>
              </div>
            )}
            <hr />
            <h3 className={style.heading}><Icon icon={faGlobeAmericas} /> {translate("experience_level")}</h3>
            <ol className={style.experience}>
              {[1, 2, 3, 4, 5].map((level) => (
                <li key={level} className={career.experience_level.id >= level ? style.active : ""} />
              ))}
            </ol>
            <p>{career.experience_level.experience}</p>
            <hr />
            <h3 className={style.heading}><Icon icon={faAdjust} /> {translate("match_rate")}</h3>
            <DangerousHTML html={translate("match_rate_html", {match_rate: career.score.toFixed(1)})} tag="p" />
            <div>
              <HighChart
                type="column"
                xAxis={{type: "category"}}
                chart={{marginRight: 50, marginLeft: 50}}
                legend={{layout: "horizontal", align: "center", width: 500, itemStyle: {width: 300}, margin: 30}}
                series={[{
                  name: `${career.title} Traits`,
                  data: careerTraits.sort((a, b) => ((a.name > b.name) ? 1 : -1))
                }, {
                  name: "Your Traits",
                  data: assessmentTraits.sort((a, b) => ((a.name > b.name) ? 1 : -1))
                }]}
              />
            </div>
            <div ref={(customContent) => { this.customContent = customContent; }} />
            <hr />
            <div>
              <h3><Icon icon={faExternalLinkSquareAlt} /> {translate("job_links")}</h3>
              <ul className={style.jobsLinks}>
                <li>
                  <a className={style.jobLink} href={`http://www.mynextmove.org/profile/summary/${career.id}`} target="_blank" rel="noopener noreferrer" title="My Next Move">
                    <img alt="My Next Move" src="https://cdn.traitify.com/assets/images/job-links/my-next-move.jpg" />
                  </a>
                </li>
                <li>
                  <a className={style.jobLink} href={`http://www.onetonline.org/link/summary/${career.id}`} target="_blank" rel="noopener noreferrer" title="O*Net Online">
                    <img alt="O*Net Online" src="https://cdn.traitify.com/assets/images/job-links/o-net-2.jpg" />
                  </a>
                </li>
                <li>
                  <a className={style.jobLink} href={`http://www.miproximopaso.org/profile/summary/${career.id}`} target="_blank" rel="noopener noreferrer" title="Mi Proximo Paso">
                    <img alt="Mi Proximo Paso" src="https://cdn.traitify.com/assets/images/job-links/mi-proximo-paso.jpg" />
                  </a>
                </li>
                <li>
                  <a className={style.jobLink} href={`http://www.mynextmove.org/vets/profile/summary/${career.id}`} target="_blank" rel="noopener noreferrer" title="My Next Move for Veterans">
                    <img alt="My Next Move for Veterans" src="https://cdn.traitify.com/assets/images/job-links/my-next-move-veterans.jpg" />
                  </a>
                </li>
              </ul>
            </div>
            <hr />
          </div>
        </section>
      </div>
    );
  }
}

export {CareerModal as Component};
export default withTraitify(CareerModal);
