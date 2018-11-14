import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Results from "./results";
import SlideDeck from "./slide-deck";

class Default extends Component {
  static propTypes = {isReady: PropTypes.func.isRequired}
  render() {
    if(this.props.isReady("results")) {
      return <Results {...this.props} />;
    }
    if(this.props.isReady("slides")) {
      return <SlideDeck {...this.props} />;
    }

    return <div />;
  }
}

export {Default as Component};
export default withTraitify(Default);
