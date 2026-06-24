const recommendationFields = `
      id
      prerequisites {
        cognitive {
          isSkipped
          status
          surveyId
          surveyName
          testId
        }
        external {
          assessmentId
          assessmentTakerUrl
          isSkipped
          signInUrl
          status
          surveyId
          surveyName
          vendor
        }
        personality {
          assessmentId
          isSkipped
          status
          surveyId
          surveyName
        }
      }
      profileId
`.trim();

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

export const recommendation = `
  query(
    $applyAssessmentExpiration: Boolean,
    $benchmarkID: String,
    $localeKey: String!,
    $packageID: String,
    $profileID: String!
  ) {
    recommendation(
      applyAssessmentExpiration: $applyAssessmentExpiration,
      benchmarkId: $benchmarkID,
      localeKey: $localeKey,
      packageId: $packageID,
      profileId: $profileID
    ) {
      ${recommendationFields}
    }
  }
`;

export const skipRecommendation = `
  mutation(
    $benchmarkID: String,
    $packageID: String,
    $profileID: String!
  ) {
    skipRecommendation(
      benchmarkId: $benchmarkID,
      packageId: $packageID,
      profileId: $profileID
    ) {
      ${recommendationFields}
    }
  }
`;

export const path = "/xavier/graphql";
