import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";
import PersonalityScoreBar from "./personality-score-bar";
import PersonalityTakeaways from "./personality-takeaways";

class FinancialRiskResults extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired
  };
  render() {
    const perspective = this.props.getOption("perspective") || "firstPerson";

    return (
      <section>
        <PersonalityScoreBar {...this.props} />
        <PersonalityArchetype {...this.props} />
        <PersonalityDetails {...this.props} />
        {perspective === "thirdPerson" && [
          <PersonalityTakeaways key="takeaways" {...this.props} />,
          <PersonalityDimensions key="dimensions" {...this.props} />
        ]}
      </section>
    );
  }
}

export {FinancialRiskResults as Component};
export default withTraitify(FinancialRiskResults);
