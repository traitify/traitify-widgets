import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDimensions from "./personality-dimensions";
import PersonalitySkills from "./personality-skills";
import PersonalityTips from "./personality-tips";
import PersonalityTraits from "../dimension-based-results/personality-traits";

class EdmResults extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired
  }
  render() {
    return (
      <section>
        <PersonalityArchetype {...this.props} />
        <PersonalitySkills {...this.props} />
        <PersonalityTips {...this.props} />
        <PersonalityDimensions {...this.props} />
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}

export default withTraitify(EdmResults);
