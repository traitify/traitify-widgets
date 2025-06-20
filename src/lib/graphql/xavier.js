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
    }
  }
`;

export const path = "/xavier/graphql";
