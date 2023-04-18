export const recommendation = `
  query(
    $benchmarkID: String!,
    $localeKey: String!,
    $profileID: String!
  ) {
    recommendation(
      benchmarkId: $benchmarkID,
      localeKey: $localeKey,
      profileId: $profileID
    ) {
      id
      prerequisites {
        cognitive {
          status
          surveyId
          testId
        }
        personality {
          assessmentId
          status
          surveyId
        }
      }
    }
  }
`;

export const path = "/xavier/graphql";
