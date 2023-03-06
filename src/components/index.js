import Container from "./container";
import Default from "./default";
import PersonalityArchetypeHeading from "./personality/archetype/heading";
import PersonalityArchetypeSkills from "./personality/archetype/skills";
import PersonalityArchetypeTips from "./personality/archetype/tips";
import PersonalityBaseDetails from "./personality/base/details";
import PersonalityBaseHeading from "./personality/base/heading";
import PersonalityDimensionChart from "./personality/dimension/chart";
import PersonalityDimensionDetails from "./personality/dimension/details";
import PersonalityDimensionList from "./personality/dimension/list";
import PersonalityRecommendationChart from "./personality/recommendation/chart";
import PersonalityTraitDetails from "./personality/trait/details";
import PersonalityTraitList from "./personality/trait/list";
import PersonalityTypeChart from "./personality/type/chart";
import PersonalityTypeList from "./personality/type/list";

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
    },
    Dimension: {
      Chart: PersonalityDimensionChart,
      Details: PersonalityDimensionDetails,
      List: PersonalityDimensionList
    },
    Recommendation: {
      Chart: PersonalityRecommendationChart
    },
    Trait: {
      Details: PersonalityTraitDetails,
      List: PersonalityTraitList
    },
    Type: {
      Chart: PersonalityTypeChart,
      List: PersonalityTypeList
    }
  }
};
