import gql from "graphql-tag";

export default gql`
  query Guide($assessmentID: String!) {
    guide(assessmentId: $assessmentID, localeKey: "en-us") {
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
