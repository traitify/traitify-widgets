import PropTypes from "prop-types";
import {Component} from "react";
import Guide from "../../guide";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";
import PersonalityTraits from "../dimension-based-results/personality-traits";

export default class CandidateResults extends Component {
  static propTypes = {
    options: PropTypes.shape({perspective: PropTypes.string}).isRequired
  }
  render() {
    return (
      <section>
        <PersonalityArchetype {...this.props} />
        <PersonalityDimensions {...this.props} />
        <PersonalityDetails {...this.props} />
        {this.props.options.perspective === "thirdPerson" && <Guide {...this.props} />}
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}
