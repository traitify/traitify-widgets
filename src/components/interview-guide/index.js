import {Component} from "react";
import ApolloClient from "apollo-boost";
import {ApolloProvider, Query} from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA==", mode: "no-cors"},
  uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
});

const Guide = () => (
  <Query
    query={gql`
      {
        guide(assessmentId: "ba706c74-c256-4367-afa6-cfb84c5ebe22", localeKey: "en-us") {
          id
          name
          deckId
          competencies {
            id
            name
            introduction
            order
            questionSequences {
              id
              name
              questions {
                id
                text
                adaptability
                order
              }
            }
          }
        }
      }
    `}
  >
    {({loading, error, data}) => {
      if(loading) return <p>Loading...</p>;
      if(error) return <p>Error :(</p>;

      return <div>{data.guide.id}</div>;
    }}
  </Query>
);

class InterviewGuide extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="interview-guide-container">
          Test IG Widget
          <Guide />
        </div>
      </ApolloProvider>
    );
  }
}

export default InterviewGuide;
