import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import {Component} from "react";
import TraitifyClient from "lib/traitify-client";
import GraphQL from "graphql/gql-client";


class Guide extends Component {
  static defaultProps = {assessmentID: null, traitify: null}
  static propTypes = {
    assessmentID: PropTypes.string,
    traitify: PropTypes.shape({
      publicKey: PropTypes.string
    })
  }
  render() {
    console.log(new TraitifyClient().graphqlQuery("/interview_guides/graphql", `{ guide(${graphql.toArgs(params)}) { ${graphql.toQuery(fields)} }}`));
    console.log(this.props);
    const {assessmentID} = this.props;
    const {publicKey} = this.props.traitify;
    console.log(publicKey);
    if(!assessmentID) { return null; }

    return (
      <div>testing</div>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);