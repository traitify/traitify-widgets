import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Guide from "../../guide";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";
import PersonalityTraits from "../dimension-based-results/personality-traits";

class CandidateResults extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired
  }
  render() {
    return (
      <section>
        <PersonalityArchetype {...this.props} />
        <PersonalityDimensions {...this.props} />
        <PersonalityDetails {...this.props} />
        {this.props.getOption("perspective") === "thirdPerson" && <Guide {...this.props} />}
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}

export default withTraitify(CandidateResults);
