export const get = `
  query($id: String!) {
    getAssessment(id: $id) {
      assessmentTakerUrl
      band
      completedAt
      externalId
      externalSurveyKey
      id
      isSkipped
      numericResult
      passFailResult
      profileId
      resultUrl
      surveyKey
      surveyType
      surveyName
      textResult
      vendor
    }
  }
`;

export const skip = `
  mutation($id: String!) {
    skipAssessment(id: $id) {
      assessmentTakerUrl
      band
      completedAt
      externalId
      externalSurveyKey
      id
      isSkipped
      numericResult
      passFailResult
      profileId
      resultUrl
      surveyKey
      surveyType
      surveyName
      textResult
      vendor
    }
  }
`;

export const path = "/assessments/external/external_assessments/graphql";
export const version = "beta";
