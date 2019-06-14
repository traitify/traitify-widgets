import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import ApolloClient from "apollo-boost";
import {ApolloProvider, Query} from "react-apollo";
import query from "graphql-queries/guide-for-assessment";

const client = new ApolloClient({
  headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA=="},
  uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
});

class Guide extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({assessment_type: PropTypes.string})
  }
  buildPersonalityTypes(types) {
    const invalidArguments = [];
    const toGraphql = types.map((type) => {
      let personalityType = type.personality_type;
      if(personalityType.level == null) { return invalidArguments.push(null); }

      personalityType = {level: personalityType.level, id: personalityType.id};
      return {personalityType};
    });

    if(invalidArguments.length > 0) {
      // Airbrake?
      return false;
    } else {
      return toGraphql;
    }
  }
  render() {
    if(!this.props.assessment) { return null; }
    const props = this.props.assessment;
    const personalityTypes = this.buildPersonalityTypes(props.personality_types);
    if(!personalityTypes) { return <div>Invalid</div>; }

    const assessment = {
      id: props.id,
      deckId: props.deck_id,
      personalityTypes
    };

    return (
      <ApolloProvider client={client}>
        <div className="guide-container">
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

export {Guide as Component};
export default withTraitify(Guide);
