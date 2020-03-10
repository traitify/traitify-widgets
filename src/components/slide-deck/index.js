import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Cognitive from "./cognitive";
import Personality from "./personality";

class SlideDeck extends Component {
  static propTypes = {isReady: PropTypes.func.isRequired}
  render() {
    // TODO: Find out how to differentiate
    if(this.props.isReady) {
      return <Cognitive {...this.props} />;
    }

    return <Personality {...this.props} />;
  }
}

export {SlideDeck as Component};
export default withTraitify(SlideDeck);
