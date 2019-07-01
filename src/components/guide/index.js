import PropTypes from "prop-types";
import TraitifyPropTypes from "lib/helpers/prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import guideQuery from "graphql/queries/guide";
import {dangerousProps} from "lib/helpers";
import smallScreen from "./helpers/helpers";
import style from "./style";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      competencies: [],
      displayedCompetency: {},
      errors: [],
      expandedIntro: false
    };
  }
  static defaultProps = {assessmentID: null}
  static propTypes = {
    translate: PropTypes.func.isRequired,
    traitify: TraitifyPropTypes.traitify.isRequired,
    assessmentID: PropTypes.string
  }
  adaptability(adaptability) {
    if(!adaptability) { return; }
    const {translate} = this.props;

    return (
      <div>
        <h4>{translate("question_adaptability")}</h4>
        <div>{this.stringToListItems(adaptability)}</div>
      </div>
    );
  }
  displayCompetency(competency) {
    const competencyName = typeof (competency) === "string" ? competency : competency.target.value;
    this.state.competencies.forEach((comp) => {
      if(competencyName === comp.name) {
        this.setState({displayedCompetency: comp});
      }
    });
  }
  expandedIntro(text) {
    if(this.state.expandedIntro) {
      return (
        <p>{text}</p>
      );
    }
  }
  handleReadMore() {
    this.setState((prevState) => ({expandedIntro: !prevState.expandedIntro}));
  }
  introduction() {
    const {introduction} = this.state.displayedCompetency;

    let intro = introduction.split(".", 1)[0];
    intro = `${intro}.`;
    const readMore = introduction.replace(intro, "").trim();
    return {intro, readMore};
  }
  selectBoxOrTabs() {
    const {displayedCompetency} = this.state;

    if(smallScreen()) {
      return (
        <div>
          <select
            value={displayedCompetency.name}
            className={style.mobileSelect}
            onChange={(e) => this.displayCompetency(e)}
          >
            {this.state.competencies.map((competency) => (
              <option value={competency.name}>{competency.name}</option>
            ))
            }
          </select>
          <p className={style.mobileBadge}>
            <img src={`https://cdn.traitify.com/assets/images/js/${this.tabImage(displayedCompetency.name)}`} alt={`${displayedCompetency.name} badge`} />
          </p>
        </div>
      );
    } else {
      return (
        <ul className={style.tabs}>
          {this.state.competencies.map((competency, index) => (
            <li className={competency.name === displayedCompetency.name ? style.tabActive : null}>
              <a
                href={`#tab-${index}`}
                tabIndex={0}
                onKeyPress={() => this.displayCompetency(competency.name)}
                onClick={() => this.displayCompetency(competency.name)}
                name={competency.name}
              >
                <img src={`https://cdn.traitify.com/assets/images/js/${this.tabImage(competency.name)}`} alt={`${competency.name} badge`} />
                <br />
                {competency.name}
              </a>
            </li>
          ))}
        </ul>
      );
    }
  }
  setGuide() {
    const params = {assessmentId: this.props.assessmentID};
    this.props.traitify.graphqlQuery("/interview_guides/graphql", guideQuery({params}))
      .then((response) => {
        if(response.errors) { this.setState({errors: response.errors}); return; }
        const {competencies} = response.data.guide;
        this.setState({competencies, displayedCompetency: competencies[0]});
      });
  }
  stringToListItems(entity) {
    let entities = entity.replace("\n", "<br/>").split("<br/>");
    entities = entities.map((e) => <li>{e}</li>);

    return (
      <ul>
        {entities}
      </ul>
    );
  }
  tabImage(tab) {
    switch(tab) {
      case "Solving Problems": return "openness.png";
      case "Delivering Results": return "conscientiousness.png";
      case "Engaging with People": return "extraversion.png";
      case "Influencing People": return "agreeableness.png";
      case "Managing Pressure": return "emotional_stability.png";
      default: return null;
    }
  }
  render() {
    if(this.state.errors.length > 0) { return <div />; }
    if(this.state.competencies.length === 0) { this.setGuide(); return <div />; }
    const {displayedCompetency} = this.state;
    const {translate} = this.props;
    const {intro, readMore} = this.introduction();

    return (
      <div className={style.tabsContainer}>
        <div className={style.tabContainer}>
          {this.selectBoxOrTabs()}
        </div>

        <div className={style.tabsContent}>
          <div className={style.tabContentActive}>
            <h2>{displayedCompetency.name}</h2>
            {intro}
            <p>
              <a
                href="#read-more"
                tabIndex={0}
                onClick={() => this.handleReadMore()}
                onKeyPress={() => this.handleReadMore()}
              >
                {translate("read_more")}
              </a>
            </p>
            {this.expandedIntro(readMore)}
            <hr />
            {displayedCompetency.questionSequences.map((sequence) => (
              <div className="competency-type">
                <h2>{sequence.name}</h2>
                <p>{translate("guide_intro")}</p>
                <p><em {...dangerousProps({html: translate("guide_get_started_html")})} /></p>
                {sequence.questions.map((question) => (
                  <div className="questions" key={question.order}>
                    <h3 id={question.order === 1 ? "question-1" : null}>{`Question ${question.order}`}</h3>
                    <p>{question.text}</p>
                    <h4>{translate("question_purpose")}</h4>
                    <div>{this.stringToListItems(question.purpose)}</div>
                    {this.adaptability(question.adaptability)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);
