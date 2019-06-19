import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import keysToCamel from "lib/helpers/casing";
import ApolloClient from "apollo-boost";
import {ApolloProvider, Query} from "react-apollo";
import query from "queries/guide-for-assessment";
import Competencies from "./competencies/index";

const client = new ApolloClient({
  headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA=="},
  uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
});

class Guide extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      id: PropTypes.string,
      deck_id: PropTypes.string,
      personality_types: PropTypes.array
    })
  }
  buildPersonalityTypes(types) {
    let invalidArguments = false;
    const toGraphql = types.map((type) => {
      const {level, id} = type.personalityType;
      if(level == null) { invalidArguments = true; }

      return {personalityType: {level, id}};
    });

    if(invalidArguments) {
      return {error: "level cannot be null"};
    } else {
      return toGraphql;
    }
  }
  render() {
    if(!this.props.assessment) { return null; }
    let assessment = keysToCamel(this.props.assessment);
    const {id, deckId} = assessment;
    let {personalityTypes} = assessment;
    personalityTypes = this.buildPersonalityTypes(personalityTypes);
    if(personalityTypes.error) { return <div>{personalityTypes.error}</div>; }

    assessment = {
      id,
      deckId,
      personalityTypes
    };
    console.log(assessment);
    return (
      <ApolloProvider client={client}>
        <div className="guide-container">
          <Query query={query} variables={{assessment}}>
            {({loading, error, data}) => {
              if(loading) return <p>Loading...</p>;
              if(error) return <p>Error :(</p>;

              console.log(data, "query data");
              return <Competencies competencies={data.guideForAssessment.competencies} />;
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);
