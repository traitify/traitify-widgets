/* eslint-disable import/prefer-default-export */
export const get = `
  query($assessmentID: String!, $localeKey: String!) {
    guide(
      assessmentId: $assessmentID,
      localeKey: $localeKey
    ) {
      competencies {
        id
        introduction
        name
        order
        questionSequences {
          id
          name
          personalityTypeId
          questions {
            adaptability
            id
            order
            purpose
            text
          }
        }
      }
    }
  }
`;
