import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import TraitifyClient from "lib/traitify-client";
import GraphQL from "graphql/gql-client";
import Competencies from "./competencies/index";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {competencies: []};
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
        const {competencies} = response.data.guide;
        this.setState({competencies});
      });
  }
  render() {
    if(this.state.competencies.length === 0) { this.setCompetencies(); return null; }

    return (
      <div className="guide-container">
        <Competencies competencies={this.state.competencies} />
      </div>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);
