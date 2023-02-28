import Container from "./container";
import Default from "./default";
import PersonalityArchetypeHeading from "./personality/archetype/heading";
import PersonalityArchetypeSkills from "./personality/archetype/skills";
import PersonalityArchetypeTips from "./personality/archetype/tips";
import PersonalityBaseDetails from "./personality/base/details";
import PersonalityBaseHeading from "./personality/base/heading";

export default {
  Container,
  Default,
  Personality: {
    Archetype: {
      Heading: PersonalityArchetypeHeading,
      Skills: PersonalityArchetypeSkills,
      Tips: PersonalityArchetypeTips
    },
    Base: {
      Details: PersonalityBaseDetails,
      Heading: PersonalityBaseHeading
    }
  }
};
