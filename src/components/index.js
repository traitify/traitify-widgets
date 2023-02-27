import Container from "./container";
import Default from "./default";
import PersonalityArchetypeHeading from "./personality/archetype/heading";
import PersonalityArchetypeSkills from "./personality/archetype/skills";

export default {
  Container,
  Default,
  Personality: {
    Archetype: {
      Heading: PersonalityArchetypeHeading,
      Skills: PersonalityArchetypeSkills
    }
  }
};
