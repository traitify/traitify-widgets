import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import TraitifyClient from "lib/traitify-client";
import GraphQL from "graphql/gql-client";
import {dangerousProps} from "lib/helpers";
import smallScreen from "./helpers/helpers";
import style from "./style";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      competencies: [],
      displayedCompetency: {},
      expandedIntro: false
    };
  }
  static defaultProps = {assessmentID: null, traitify: null}
  static propTypes = {
    translate: PropTypes.func.isRequired,
    assessmentID: PropTypes.string,
    traitify: PropTypes.shape({
      publicKey: PropTypes.string
    })
  }
  setCompetencies() {
    const {assessmentID} = this.props;
    const params = {
      assessmentId: assessmentID,
      localeKey: "en-US"
    };
    const fields = [
      "deckId", "id", "name",
      {competencies: ["id", "name", "introduction", "order", {questionSequences: ["id", "name", {questions: ["id", "text", "adaptability", "order", "purpose"]}]}]}
    ];
    const graphql = new GraphQL();
    new TraitifyClient().graphqlQuery("/interview_guides/graphql", `{ guide(${graphql.toArgs(params)}) { ${graphql.toQuery(fields)} }}`)
      .then((response) => {
        console.log(response.data);
        const {competencies} = response.data.guide;
        this.setState({competencies, displayedCompetency: competencies[0]});
      });
  }
  displayCompetency(competency) {
    const competencyName = typeof (competency) === "string" ? competency : competency.target.value;
    this.state.competencies.forEach((comp) => {
      if(competencyName === comp.name) {
        this.setState({displayedCompetency: comp});
      }
    });
  }
  adaptability(adaptability) {
    if(!adaptability) { return; }
    const {translate} = this.props;

    return (
      <div>
        <h4>{translate("question_adaptability")}</h4>
        <div>{adaptability}</div>
      </div>
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
  handleReadMore() {
    this.setState((prevState) => ({expandedIntro: !prevState.expandedIntro}));
  }
  expandedIntro(text) {
    if(this.state.expandedIntro) {
      return (
        <p>{text}</p>
      );
    }
  }
  introduction() {
    // const {translate} = this.props;
    const {introduction} = this.state.displayedCompetency;

    let intro = introduction.split(".", 1)[0];
    intro = `${intro}.`;
    let readMore = introduction.replace(intro, "");
    readMore = readMore.trim();
    return {intro, readMore};
  }
  render() {
    if(this.state.competencies.length === 0) { this.setCompetencies(); return <div />; }
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
                href="#t"
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
                  <div className="questions">
                    <h3 id={question.order === 1 ? "question-1" : null}>{`Question ${question.order}`}</h3>
                    <p>{question.text}</p>
                    <h4>{translate("question_purpose")}</h4>
                    <div>{question.purpose}</div>
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
