import Container from "./container";
import Default from "./default";
import PersonalityArchetypeHeading from "./personality/archetype/heading";
import PersonalityArchetypeSkills from "./personality/archetype/skills";
import PersonalityArchetypeTips from "./personality/archetype/tips";
import PersonalityBaseDetails from "./personality/base/details";
import PersonalityBaseHeading from "./personality/base/heading";
import PersonalityCareerContainer from "./personality/career/container";
import PersonalityCareerDetails from "./personality/career/details";
import PersonalityCareerFilter from "./personality/career/filter";
import PersonalityCareerList from "./personality/career/list";
import PersonalityCareerModal from "./personality/career/modal";
import PersonalityDimensionChart from "./personality/dimension/chart";
import PersonalityDimensionDetails from "./personality/dimension/details";
import PersonalityDimensionList from "./personality/dimension/list";
import PersonalityRecommendationChart from "./personality/recommendation/chart";
import PersonalityTraitDetails from "./personality/trait/details";
import PersonalityTraitList from "./personality/trait/list";
import PersonalityTypeChart from "./personality/type/chart";
import PersonalityTypeList from "./personality/type/list";
import AttractReport from "./report/attract";
import CandidateReport from "./report/candidate";
import EmployeeReport from "./report/employee";
import ManagerReport from "./report/manager";

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
    Career: {
      Container: PersonalityCareerContainer,
      Details: PersonalityCareerDetails,
      Filter: PersonalityCareerFilter,
      List: PersonalityCareerList,
      Modal: PersonalityCareerModal
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
  },
  Report: {
    Attract: AttractReport,
    Candidate: CandidateReport,
    Employee: EmployeeReport,
    Manager: ManagerReport
  }
};
