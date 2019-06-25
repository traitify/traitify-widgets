/*eslint-disable */
import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import TraitifyClient from "lib/traitify-client";
import GraphQL from "graphql/gql-client";
// import Competencies from "./competencies/index";
// <Competencies competencies={this.state.competencies} />
import style from "./style";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {competencies: [], displayedCompetency: {}};
  }
  static defaultProps = {assessmentID: null, traitify: null}
  static propTypes = {
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
      {competencies: ["id", "name", "introduction", "order", {questionSequences: ["id", "name", {questions: ["id", "text", "adaptability", "order"]}]}]}
    ];
    const graphql = new GraphQL();
    new TraitifyClient().graphqlQuery("/interview_guides/graphql", `{ guide(${graphql.toArgs(params)}) { ${graphql.toQuery(fields)} }}`)
      .then((response) => {
        console.log(response.data);
        const {competencies} = response.data.guide;
        this.setState({competencies, displayedCompetency: competencies[0]});
      });
  }
  displayedCompetency(competency) {
    console.dir(competency.target.name);
    this.state.competencies.forEach((comp) => {
      if(competency.target.name === comp.name) {
        this.setState({displayedCompetency: comp});
      }
    });
  }
  render() {
    if(this.state.competencies.length === 0) { this.setCompetencies(); return null; }
    const {displayedCompetency} = this.state;

    return (
      <div className={style.tabsContainer}>
        <div className={style.tabContainer}>
          <ul className={style.tabs}>
            {this.state.competencies.map((competency, index) => (
              <li
                className={style.tabActive}
                role="link"
                tabIndex={0}
                onKeyPress={(e) => this.displayedCompetency(e)}
                onClick={(e) => this.displayedCompetency(e)}
                name={competency.name}
              >
                <a href={`#tab-${index}`} name={competency.name}>
                  <img src="//placehold.it/100x100" alt="Type Name badge" name={competency.name} />
                  <br />
                  {competency.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={style.tabsContent}>
          <div id="tab-1" className={style.tabContentActive}>
            <h2>{displayedCompetency.name}</h2>
            <p>{displayedCompetency.introduction}</p>
            <p><a href="#">Read More</a></p>
            <hr />
            {displayedCompetency.questionSequences.map((sequence) => (
              <div className="competency-type">
                <h2>{sequence.name}</h2>
                <p>These personality characteristics provide the basis for asking a particular sequence of questions of each of the personality 'types'. The first question is looking to confirm what they should be like; the second two explore areas of possible concern.</p>
                <p><em>To get things going you might like to start with <span>Question 1</span></em></p>
                {sequence.questions.map((question) => (
                  <div className="questions">
                    <h3>{`Question ${question.order}`}</h3>
                    <p>{question.text}</p>
                    <h4>What are you trying to find out?</h4>
                    <ul>
                      <li>Adipisicing fugiat asperiores eius eum commodi unde, necessitatibus atque Ullam ipsa deserunt incidunt fuga harum Voluptate at illo autem atque maxime. Debitis perspiciatis omnis quae incidunt ducimus Enim earum fuga?</li>
                      <li>Adipisicing fugiat asperiores eius eum commodi unde, necessitatibus atque Ullam ipsa deserunt incidunt fuga harum Voluptate at illo autem atque maxime. Debitis perspiciatis omnis quae incidunt ducimus Enim earum fuga?</li>
                      <li>Adipisicing fugiat asperiores eius eum commodi unde, necessitatibus atque Ullam ipsa deserunt incidunt fuga harum Voluptate at illo autem atque maxime. Debitis perspiciatis omnis quae incidunt ducimus Enim earum fuga?</li>
                      <li>Adipisicing fugiat asperiores eius eum commodi unde, necessitatibus atque Ullam ipsa deserunt incidunt fuga harum Voluptate at illo autem atque maxime. Debitis perspiciatis omnis quae incidunt ducimus Enim earum fuga?</li>
                    </ul>
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
