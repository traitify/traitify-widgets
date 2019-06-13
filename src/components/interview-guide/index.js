import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";
// import query from "graphql-queries/guide";
// import query from "graphql-queries/guide-for-assessment";
// import keysToCamel from "lib/helpers/casing";

const client = new ApolloClient({
  headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA==", mode: "no-cors"},
  uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
});

class InterviewGuide extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({assessment_type: PropTypes.string})
  }
  // variables={{assessment_id: "ba706c74-c256-4367-afa6-cfb84c5ebe22"}
  buildTypes(types) {
    return types.map((type) => ({personalityType: type.personality_type}));
  }
  render() {
    if(!this.props.assessment) { return null; }
    if(this.props.assessment) {
      console.log("waasss");
    }

    const props = this.props.assessment;
    const assessment = {
      id: props.id,
      deckId: props.deck_id,
      personalityTypes: this.buildTypes(props.personality_types)
    };
    console.log(assessment);

    return (
      <ApolloProvider client={client}>
        <div className="interview-guide-container">
          ddd
        </div>
      </ApolloProvider>
    );
  }
}

export {InterviewGuide as Component};
export default withTraitify(InterviewGuide);

// <Query query={query} variables={{assessment}}>
//   {({loading, error, data}) => {
//     if(loading) return <p>Loading...</p>;
//     if(error) return <p>Error :(</p>;
//
//     console.log(data, "query data");
//     return <div>testing please wait a moment</div>;
//   }}
// </Query>
