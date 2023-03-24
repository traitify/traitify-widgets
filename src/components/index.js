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
import PersonalityTraitDetails from "./personality/trait/details";
import PersonalityTraitList from "./personality/trait/list";
import PersonalityTypeChart from "./personality/type/chart";
import PersonalityTypeList from "./personality/type/list";
import AttractReport from "./report/attract";
import CandidateReport from "./report/candidate";
import EmployeeReport from "./report/employee";
import ManagerReport from "./report/manager";
import CareerContainer from "./results/career/container";
import CareerDetails from "./results/career/details";
import CareerFilter from "./results/career/filter";
import CareerList from "./results/career/list";
import CareerModal from "./results/career/modal";
import CognitiveResults from "./results/cognitive";
import Guide from "./results/guide";
import RecommendationChart from "./results/recommendation/chart";

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
  },
  Results: {
    Career: {
      Container: CareerContainer,
      Details: CareerDetails,
      Filter: CareerFilter,
      List: CareerList,
      Modal: CareerModal
    },
    Cognitive: CognitiveResults,
    Guide,
    Recommendation: {
      Chart: RecommendationChart
    }
  }
};
