import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";

export default function EmployeeResults(props) {
  return (
    <section>
      <PersonalityArchetype {...props} />
      <PersonalitySkills {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} />
    </section>
  );
}
