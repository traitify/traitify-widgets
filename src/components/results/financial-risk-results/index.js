import {Component} from "react";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";
import PersonalityScoreBar from "./personality-score-bar";
import PersonalityTakeaways from "./personality-takeaways";

export default class FinancialRiskResults extends Component {
  render() {
    return (
      <section>
        <PersonalityScoreBar {...this.props} />
        <PersonalityArchetype {...this.props} />
        <PersonalityDetails {...this.props} />
        <PersonalityTakeaways {...this.props} />
        <PersonalityDimensions {...this.props} />
      </section>
    );
  }
}
