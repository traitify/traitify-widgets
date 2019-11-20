import {Component} from "react";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";

export default class CandidateResults extends Component {
  render() {
    return (
      <section>
        <PersonalityArchetype {...this.props} />
        <PersonalityDimensions {...this.props} />
        <PersonalityDetails {...this.props} />
      </section>
    );
  }
}
