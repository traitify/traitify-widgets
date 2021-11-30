import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import Results from "./results";
import SlideDeck from "./slide-deck";

function Default(props) {
  if(props.isReady("results")) { return <Results {...props} />; }
  if(props.isReady("slides")) { return <SlideDeck {...props} />; }

  return <div />;
}

Default.propTypes = {isReady: PropTypes.func.isRequired};

export {Default as Component};
export default withTraitify(Default);
