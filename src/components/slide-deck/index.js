import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Cognitive from "./cognitive";
import Personality from "./personality";

class SlideDeck extends Component {
  static propTypes = {getOption: PropTypes.func.isRequired}
  render() {
    if(this.props.getOption("surveyType") === "cognitive") {
      return <Cognitive {...this.props} />;
    }

    return <Personality {...this.props} />;
  }
}

export {SlideDeck as Component};
export default withTraitify(SlideDeck);
