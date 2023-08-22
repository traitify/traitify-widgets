export const get = `
  query($assessmentID: String!, $benchmarkID: String, $localeKey: String!) {
    customInterviewGuide(
      assessmentId: $assessmentID,
      benchmarkId: $benchmarkID,
      localeKey: $localeKey
    ) {
      clientInterviewGuide {
        introduction
        sections {
          id
          introduction
          questionSequences {
            id
            introduction
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
