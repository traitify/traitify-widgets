/* eslint-disable */
import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import TraitifyClient from "lib/traitify-client";
import GraphQL from "graphql/gql-client";
import smallScreen from "./helpers/helpers";
import style from "./style";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {competencies: [], displayedCompetency: {}};
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
    competency = typeof(competency) === "string" ? competency : competency.target.value;
    this.state.competencies.forEach((comp) => {
      if(competency === comp.name) {
        this.setState({displayedCompetency: comp});
      }
    });
  }
  adaptability(adaptability) {
    if(!adaptability) { return; }
    const {translate} = this.props

    return (
      <div>
        <h4>{translate("adaptability")}</h4>
        <div>{adaptability}</div>
      </div>
    );
  }
  tabImage(tab) {
    console.log(tab);
    switch(tab) {
      case "Solving Problems": return "openness.png";
      case "Delivering Results": return "conscientiousness.png";
      case "Engaging with People": return "extraversion.png";
      case "Influencing People": return "agreeableness.png";
      case "Managing Pressure": return "emotional_stability.png";
    }
  }
  selectBoxOrTabs() {
    if(smallScreen()) {
      return (
        <select value={this.state.displayedCompetency.name} onChange={(e) => this.displayCompetency(e)}>
          {this.state.competencies.map((competency, index) => (<option value={competency.name}>{competency.name}</option>))}
        </select>
      );
    } else {
      return (
        <ul className={style.tabs}>
          {this.state.competencies.map((competency, index) => (
            <li
              className={style.tabActive}
              role="link"
              tabIndex={0}
              onKeyPress={(e) => this.displayCompetency(competency.name)}
              onClick={(e) => this.displayCompetency(competency.name)}
              name={competency.name}
            >
              <a href={`#tab-${index}`} value={competency.name}>
                <img src={`https://cdn.traitify.com/assets/images/js/${this.tabImage(competency.name)}`} alt="Type Name badge" value={competency.name} />
                <br />
                {competency.name}
              </a>
            </li>
          ))}
        </ul>
      );
    }
  }
  render() {
    const {translate} = this.props
    if(this.state.competencies.length === 0) { this.setCompetencies(); return <div />; }
    const {displayedCompetency} = this.state;

    return (
      <div className={style.tabsContainer}>
        <div className={style.tabContainer}>
          {this.selectBoxOrTabs()}
        </div>

        <div className={style.tabsContent}>
          <div id="tab-1" className={style.tabContentActive}>
            <h2>{displayedCompetency.name}</h2>
            <p>{displayedCompetency.introduction}</p>
            <p><a href="#">{translate("read_more")}</a></p>
            <hr />
            {displayedCompetency.questionSequences.map((sequence) => (
              <div className="competency-type">
                <h2>{sequence.name}</h2>
                <p>{translate("guide_intro")}</p>
                <p><em>{translate("guide_get_started_html")}</em></p>
                {sequence.questions.map((question) => (
                  <div className="questions">
                    <h3>{`Question ${question.order}`}</h3>
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
