import PersonalityArchetype from "components/results/personality/archetype/details";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityTraits from "components/results/personality/trait/list";

export default function EmployeeResults(props) {
  return (
    <section>
      <PersonalityArchetype {...props} />
      <PersonalitySkills {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} />
      <PersonalityTraits {...props} />
    </section>
  );
}
