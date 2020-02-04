import {Component} from "react";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";
import PersonalityTraits from "../dimension-based-results/personality-traits";

export default class CandidateResults extends Component {
  render() {
    return (
      <section>
        <PersonalityArchetype {...this.props} />
        <PersonalityDimensions {...this.props} />
        <PersonalityDetails {...this.props} />
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}
