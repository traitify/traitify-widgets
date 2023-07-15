export const recommendation = `
  query(
    $benchmarkID: String,
    $localeKey: String!,
    $packageID: String,
    $profileID: String!
  ) {
    recommendation(
      benchmarkId: $benchmarkID,
      localeKey: $localeKey,
      packageId: $packageID,
      profileId: $profileID
    ) {
      id
      prerequisites {
        cognitive {
          status
          surveyId
          testId
        }
        externalAssessment {
          assessmentId
          externalAssessmentId
          link
          status
          vendor
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
