import Container from "./container";
import Default from "./default";
import PersonalityArchetypeHeading from "./personality/archetype/heading";
import PersonalityArchetypeSkills from "./personality/archetype/skills";
import PersonalityArchetypeTips from "./personality/archetype/tips";

export default {
  Container,
  Default,
  Personality: {
    Archetype: {
      Heading: PersonalityArchetypeHeading,
      Skills: PersonalityArchetypeSkills,
      Tips: PersonalityArchetypeTips
    }
  }
};
