import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import ApolloClient from "apollo-boost";
import {ApolloProvider, Query} from "react-apollo";
import query from "queries/guide";
import Competencies from "./competencies/index";

const client = new ApolloClient({
  headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA=="},
  uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
});

class Guide extends Component {
  static defaultProps = {assessmentID: null}
  static propTypes = {
    assessmentID: PropTypes.string
  }
  render() {
    if(!this.props.assessmentID) { return null; }

    return (
      <ApolloProvider client={client}>
        <div className="guide-container">
          <Query query={query} variables={{assessmentId: this.props.assessmentID}}>
            {({loading, error, data}) => {
              if(loading) return <p>Loading...</p>;
              if(error) return <p>Error :(</p>;

              console.log(data, "query data");
              return <Competencies competencies={data.guide.competencies} />;
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);
