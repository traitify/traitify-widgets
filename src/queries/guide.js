import gql from "graphql-tag";

export default gql`
  query Guide($assessmentId: String!) {
    guide(assessmentId: $assessmentId, localeKey: "en-us") {
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
