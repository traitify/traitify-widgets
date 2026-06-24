const assessment = `
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
      signInUrl
      surveyKey
      surveyName
      textResult
      vendor
`.trim();

export const get = `
  query($id: String!) {
    getAssessment(id: $id) {
      ${assessment}
    }
  }
`;

export const getOrCreate = `
  query($profileID: String!, $surveyKey: String!) {
    getOrCreateAssessment(profileId: $profileID, surveyKey: $surveyKey) {
      ${assessment}
    }
  }
`;

export const skip = `
  mutation($id: String!) {
    skipAssessment(id: $id) {
      ${assessment}
    }
  }
`;

export const surveys = `
  query($vendor: String!) {
    listSurveys(vendor: $vendor) {
      externalSurveyKey
      surveyKey
      surveyName
    }
  }
`;

export const vendors = `
  query {
    listVendors {
      vendors
    }
  }
`;

export const path = "/assessments/external/external_assessments/graphql";
export const version = "beta";
