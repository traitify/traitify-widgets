import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import {Component as Paradox} from "components/paradox/results/personality/career/details";
import style from "./style.scss";

class Career extends Component {
  static propTypes = {
    career: PropTypes.shape({
      description: PropTypes.string.isRequired,
      experience_level: PropTypes.shape({
        id: PropTypes.number.isRequired
      }).isRequired,
      picture: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("Career.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("Career.updated", this);
  }
  openModal = () => {
    this.props.ui.trigger("CareerModal.career", this, this.props.career);
    this.props.ui.trigger("CareerModal.show", this);
  };
  render() {
    const {career, translate} = this.props;

    return (
      <button className={style.container} onClick={this.openModal} type="button">
        <img alt={career.title} src={career.picture} />
        <div className={style.content}>
          <h2 className={style.title}>{career.title}</h2>
          <p className={style.description}>{career.description}</p>
          <h3 className={style.subtitle}>{translate("experience_level")}</h3>
          <ol className={style.experience}>
            {[1, 2, 3, 4, 5].map((level) => (
              <li key={level} className={career.experience_level.id >= level ? style.active : ""} />
            ))}
          </ol>
          <h3 className={style.subtitle}>{translate("education")}</h3>
          <p className={style.education}>
            {translate(`experience_level_${career.experience_level.id}`)}
          </p>
          <h3 className={style.subtitle}>
            {translate("match_rate")}
            <i className={style.matchRatePercent}>{Math.round(career.score)}%</i>
          </h3>
          <div className={style.matchRate}>
            <span data-match-rate={`${career.score}%`} style={{width: `${career.score}%`}} />
          </div>
        </div>
      </button>
    );
  }
}

export {Career as Component};
export default withTraitify(Career, {paradox: Paradox});
