// import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import TraitifyClient from "lib/traitify-client";
import GraphQL from "graphql/gql-client";

class Guide extends Component {
  // static defaultProps = {assessmentID: null, traitify: null}
  // static propTypes = {
  //   assessmentID: PropTypes.string,
  //   traitify: PropTypes.shape({
  //     publicKey: PropTypes.string
  //   })
  // }
  render() {
    const params = {
      assessmentId: "4f2a3c1c-57e4-4a86-b59c-4ebbf7787a8a",
      localeKey: "en-US"
    };
    const fields = [
      "deckId", "id", "name",
      {competencies: ["id", "name", "introduction", "order", {questionSequences: ["id", "name", {questions: ["id", "text", "adaptability", "order"]}]}]}
    ];
    const graphql = new GraphQL();
    // graphql.toQuery(fields);
    // console.log(graphql);
    console.log(new TraitifyClient().graphqlQuery("/interview_guides/graphql", `{ guide(${graphql.toArgs(params)}) { ${graphql.toQuery(fields)} }}`));

    return (
      <div className="guide-container">
        testing
      </div>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);
