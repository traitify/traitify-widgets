import {
  faAdjust,
  faChartBar,
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
import {dangerousProps} from "lib/helpers";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class CareerModal extends Component {
  static propTypes = {
    traitify: TraitifyPropTypes.traitify.isRequired,
    translate: PropTypes.func.isRequired
  }
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

    if(!show || !career) { return null; }

    const {translate} = this.props;
    let salary = career.salary_projection && career.salary_projection.annual_salary_mean;
    salary = salary && `$${Math.round(salary)}`;
    let growth = career.employment_projection && career.employment_projection.percent_growth_2022;
    growth = growth && `${growth}%`;

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
            {showLegend && (
              <div className={style.legend}>
                <ul className={style.info}>
                  <li>
                    <h4><Icon icon={faDollarSign} /> {translate("salary_mean")}:</h4>
                    <p {...dangerousProps({html: translate("salary_mean_html")})} />
                  </li>
                  <li>
                    <h4><Icon icon={faChartBar} /> {translate("employment_growth")}:</h4>
                    <p {...dangerousProps({html: translate("employment_growth_html")})} />
                  </li>
                  <li>
                    <h4><Icon icon={faGraduationCap} /> {translate("education")}:</h4>
                    <p {...dangerousProps({html: translate("education_html")})} />
                  </li>
                </ul>
                <ul className={style.info}>
                  <li>
                    <h4><Icon icon={faLightbulb} /> {translate("bright_future")}:</h4>
                    <p {...dangerousProps({html: translate("bright_future_html")})} />
                  </li>
                  <li>
                    <h4><Icon icon={faLeaf} /> {translate("green_career")}:</h4>
                    <p {...dangerousProps({html: translate("green_career_html")})} />
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
            <p {...dangerousProps({html: translate("match_rate_html", {match_rate: career.score.toFixed(1)})})} />
            <div ref={(customContent) => { this.customContent = customContent; }} />
          </div>
        </section>
      </div>
    );
  }
}

export {CareerModal as Component};
export default withTraitify(CareerModal);
