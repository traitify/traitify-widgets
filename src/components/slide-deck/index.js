import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import Cognitive from "./cognitive";
import Personality from "./personality";

function SlideDeck(props) {
  if(props.getOption("surveyType") === "cognitive") { return <Cognitive {...props} />; }

  return <Personality {...props} />;
}

SlideDeck.propTypes = {getOption: PropTypes.func.isRequired};

export {SlideDeck as Component};
export default withTraitify(SlideDeck);
