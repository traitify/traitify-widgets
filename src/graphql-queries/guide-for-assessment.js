import gql from "graphql-tag";

export default gql`
  query GuideForAssessment($assessment: Assessment!) {
    guideForAssessment(assessment: $assessment, localeKey: "en-us") {
      id
      name
      deckId
      competencies {
        id
        name
        introduction
        order
        questionSequences {
          id
          name
          questions {
            id
            text
            adaptability
            order
          }
        }
      }
    }
  }
`;
