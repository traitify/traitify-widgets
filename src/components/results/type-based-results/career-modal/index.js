/* eslint-disable react/no-unused-class-component-methods */
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component} from "react";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";
import CareerInfo from "./career-info";
import Clubs from "./clubs";
import Jobs from "./jobs";
import Majors from "./majors";

class CareerModal extends Component {
  static propTypes = {
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
      selectedTab: "career"
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
  close = () => { this.props.ui.trigger("CareerModal.hide", this); };
  hide = () => { this.setState({show: false}); };
  setCareer = () => { this.setState({career: this.props.ui.current["CareerModal.career"]}); };
  show = () => { this.setState({show: true}); };
  toggleLegend = () => { this.setState((state) => ({showLegend: !state.showLegend})); };
  render() {
    const {career, show} = this.state;
    const {assessment, isReady, translate} = this.props;
    if(!show || !career) { return null; }
    if(!isReady("results")) { return null; }

    const tabs = {
      career: "Career Info",
      clubs: "Clubs",
      majors: "Majors",
      jobs: "Jobs"
    };
    const getSelected = () => tabs[this.state.selectedTab];
    const selectTab = (tabName) => { this.setState({selectedTab: tabName}); };
    const isSelected = (tabName) => this.state.selectedTab === tabName;

    return (
      <div className={`${style.modal} ${style.container}`} role="dialog">
        <section className={style.modalContainer}>
          <div className={style.modalContent}>
            <div className={style.header}>
              <div>Career Details</div>
              <div>
                <Icon aria-label={translate("close")} className={style.close} icon={faTimes} onClick={this.close} tabIndex="-1" />
              </div>
            </div>
            <hr className={style.grayDivider} />
            <div className={style.careerContainer}>
              <img className={style.image} alt={career.title} src={career.picture} />
              <div className={style.careerDetails}>
                <div className={style.title}>{career.title}</div>
                <div className={style.description}>{career.description}</div>
              </div>
            </div>
            <div className={style.content}>
              <div className={style.contentTabs}>
                <div
                  className={isSelected("career") ? style.navButtonActive : style.navButton}
                  onClick={() => selectTab("career")}
                  onKeyDown={() => selectTab("career")}
                  role="button"
                  tabIndex={0}
                >
                  Career Info
                  <hr className={isSelected("career") ? style.blueDivider : style.grayDivider} />
                </div>
                <div
                  className={isSelected("clubs") ? style.navButtonActive : style.navButton}
                  onClick={() => selectTab("clubs")}
                  onKeyDown={() => selectTab("career")}
                  role="button"
                  tabIndex={0}
                >
                  Clubs
                  <hr className={isSelected("clubs") ? style.blueDivider : style.grayDivider} />
                </div>
                <div
                  className={isSelected("majors") ? style.navButtonActive : style.navButton}
                  onClick={() => selectTab("majors")}
                  onKeyDown={() => selectTab("career")}
                  role="button"
                  tabIndex={0}
                >
                  Majors
                  <hr className={isSelected("majors") ? style.blueDivider : style.grayDivider} />
                </div>
                <div
                  className={isSelected("jobs") ? style.navButtonActive : style.navButton}
                  onClick={() => selectTab("jobs")}
                  onKeyDown={() => selectTab("career")}
                  role="button"
                  tabIndex={0}
                >
                  Jobs
                  <hr className={isSelected("jobs") ? style.blueDivider : style.grayDivider} />
                </div>
                <button type="button" className={style.navDropdown}>{getSelected()}</button>
              </div>
              {isSelected("career") && <CareerInfo assessment={assessment} translate={translate} career={career} />}
              {isSelected("clubs") && <Clubs />}
              {isSelected("majors") && <Majors />}
              {isSelected("jobs") && <Jobs />}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export {CareerModal as Component};
export default withTraitify(CareerModal);
