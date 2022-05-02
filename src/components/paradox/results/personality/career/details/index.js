import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
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
    ui: TraitifyPropTypes.ui.isRequired,
    setElement: PropTypes.func.isRequired
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
    const {career, translate, setElement} = this.props;

    return (
      <div className={style.container} id={style.container} ref={setElement}>
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
                  {`${translate("match_rate")}:`}
                  <i className={style.matchRatePercent}>{Math.round(career.score)}%</i>
                </h3>
                <div className={style.matchRate}>
                  <span data-match-rate={`${career.score}%`} style={{width: `${career.score}%`}} />
                </div>
              </div>
              <div className={style.innerContent}>
                <div>
                  <h3 className={style.subtitleFull}>{`${translate("experience_level")}:`}</h3>
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
                  <h3 className={style.subtitleFull}>{`${translate("education")}:`}</h3>
                  <h3 className={style.subtitleFull}>
                    {`${translate(`experience_level_${career.experience_level.id}`)}:`}
                  </h3>
                </div>
              </div>
              <div className={style.learnMore}>
                <button type="button" onClick={this.openModal}>Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export {Career as Component};
export default withTraitify(Career);
