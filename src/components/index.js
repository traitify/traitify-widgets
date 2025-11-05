import Container from "./container";
import Default from "./default";
import AttractReport from "./report/attract";
import CandidateReport from "./report/candidate";
import EmployeeReport from "./report/employee";
import ManagerReport from "./report/manager";
import Results from "./results";
import CareerContainer from "./results/career/container";
import CareerDetails from "./results/career/details";
import CareerFilter from "./results/career/filter";
import CareerList from "./results/career/list";
import CareerModal from "./results/career/modal";
import CognitiveResults from "./results/cognitive";
import CognitiveChart from "./results/cognitive/chart";
import GenericResults from "./results/generic";
import ClientGuide from "./results/guide/client";
import PersonalityGuide from "./results/guide/personality";
import ArchetypeHeading from "./results/personality/archetype/heading";
import ArchetypeSkills from "./results/personality/archetype/skills";
import ArchetypeTips from "./results/personality/archetype/tips";
import BaseDetails from "./results/personality/base/details";
import BaseHeading from "./results/personality/base/heading";
import DimensionChart from "./results/personality/dimension/chart";
import DimensionDetails from "./results/personality/dimension/details";
import DimensionList from "./results/personality/dimension/list";
import TraitDetails from "./results/personality/trait/details";
import TraitList from "./results/personality/trait/list";
import TypeChart from "./results/personality/type/chart";
import TypeList from "./results/personality/type/list";
import RecommendationChart from "./results/recommendation/chart";
import Status from "./status";
import Survey from "./survey";
import CognitiveSurvey from "./survey/cognitive";
import GenericSurvey from "./survey/generic";
import PersonalitySurvey from "./survey/personality";

export default {
  Container,
  Default,
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
    Cognitive: {
      Chart: CognitiveChart,
      Container: CognitiveResults
    },
    Container: Results,
    Generic: GenericResults,
    Guide: {
      Client: ClientGuide,
      Personality: PersonalityGuide
    },
    Personality: {
      Archetype: {
        Heading: ArchetypeHeading,
        Skills: ArchetypeSkills,
        Tips: ArchetypeTips
      },
      Base: {
        Details: BaseDetails,
        Heading: BaseHeading
      },
      Dimension: {
        Chart: DimensionChart,
        Details: DimensionDetails,
        List: DimensionList
      },
      Trait: {
        Details: TraitDetails,
        List: TraitList
      },
      Type: {
        Chart: TypeChart,
        List: TypeList
      }
    },
    Recommendation: {
      Chart: RecommendationChart
    }
  },
  Status,
  Survey: {
    Cognitive: CognitiveSurvey,
    Container: Survey,
    Generic: GenericSurvey,
    Personality: PersonalitySurvey
  }
};
