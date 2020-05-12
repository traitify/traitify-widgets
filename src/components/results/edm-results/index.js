import {Component} from "react";
import PersonalityArchetype from "components/results/personality/archetype/details";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityTraits from "components/results/personality/trait/list";

export default class EdmResults extends Component {
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
