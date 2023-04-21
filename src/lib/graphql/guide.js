export const get = `
  query($assessmentID: String!, $localeKey: String!) {
    customInterviewGuide(
      assessmentId: $assessmentID,
      localeKey: $localeKey
    ) {
      clientInterviewGuide {
        introduction
        sections {
          id
          introduction
          questionSequences {
            id
            questions {
              id
              text
            }
            title
          }
          title
        }
        title
      }
      personalityInterviewGuide {
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
  }
`;

export const path = "/interview_guides/graphql";
