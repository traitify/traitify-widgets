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
          surveyName
          testId
        }
        external {
          assessmentId
          assessmentTakerUrl
          status
          surveyId
          surveyName
          vendor
        }
        personality {
          assessmentId
          status
          surveyId
          surveyName
        }
      }
    }
  }
`;

export const path = "/xavier/graphql";
