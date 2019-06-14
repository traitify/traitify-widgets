import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import ApolloClient from "apollo-boost";
import {ApolloProvider, Query} from "react-apollo";
import query from "graphql-queries/guide-for-assessment";

const client = new ApolloClient({
  headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA==", mode: "no-cors"},
  uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
});

class InterviewGuide extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({assessment_type: PropTypes.string})
  }
  buildTypes(types) {
    return types.map((type) => {
      let personalityType = type.personality_type;
      personalityType = {level: personalityType.level, id: personalityType.id};
      return {personalityType};
    });
  }
  render() {
    if(!this.props.assessment) { return null; }

    const props = this.props.assessment;
    const assessment = {
      id: props.id,
      deckId: props.deck_id,
      personalityTypes: this.buildTypes(props.personality_types)
    };

    return (
      <ApolloProvider client={client}>
        <div className="interview-guide-container">
          <Query query={query} variables={{assessment}}>
            {({loading, error, data}) => {
              if(loading) return <p>Loading...</p>;
              if(error) return <p>Error :(</p>;

              console.log(data, "query data");
              return <div>testing please wait a moment</div>;
            }}
          </Query>
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
