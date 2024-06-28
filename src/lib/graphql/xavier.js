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

export const feedbackSurvey = `
  query(
    $surveyId: String!,
    $localeKey: String!
  ) {
    feedbackSurvey(
      surveyId: $surveyId,
      localeKey: $localeKey
    ) {
        id
        title
        questions {
          id
          text
          questionType
          multipleChoiceOptions {
            id
            text
          }
        }
    }
  }
`;

export const path = "/xavier/graphql";
