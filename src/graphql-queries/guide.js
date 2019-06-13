import gql from "graphql-tag";

export default gql`
  query InterviewGuide($assessment_id: String!) {
    guide(assessmentId: $assessment_id, localeKey: "en-us") {
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
