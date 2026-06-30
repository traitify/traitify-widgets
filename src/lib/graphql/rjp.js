const assessment = `
      completedAt
      failedReason
      id
      insertedAt
      instructions
      isFit
      jobId
      localeKey
      optedOut
      profileId
      responses {
        id
        questionId
        questionText
        responseOptions {
          responseOptionId
          responseOptionText
        }
        selectedResponseOptionId
        selectedResponseOptionText
      }
      startedAt
      status
      surveyId
      totalCorrectResponses
      updatedAt
      videos {
        thumbnailUrl
        videoUrl
      }
`.trim();

export const create = `
  mutation(
    $localeKey: String,
    $profileID: String,
    $surveyID: String!
  ) {
    createAssessment(
      localeKey: $localeKey,
      profileId: $profileID,
      surveyId: $surveyID
    ) {
      ${assessment}
    }
  }
`;

export const get = `
  query($id: ID!) {
    getAssessment(id: $id) {
      ${assessment}
    }
  }
`;

export const optOutAssessment = `
  mutation(
    $id: ID!,
    $optedOut: Boolean
  ) {
    optOutAssessment(
      id: $id,
      optedOut: $optedOut
    ) {
      ${assessment}
    }
  }
`;

export const start = `
  mutation($id: ID!) {
    startAssessment(id: $id) {
      ${assessment}
    }
  }
`;

export const skip = `
  mutation($id: ID!) {
    skipAssessment(id: $id) {
      id
      isSkipped
    }
  }
`;

export const update = `
  mutation(
    $answers: [AssessmentAnswer],
    $deferredComplete: Boolean,
    $id: String!
  ) {
    updateAssessment(
      answers: $answers,
      deferredComplete: $deferredComplete,
      id: $id
    ) {
      ${assessment}
    }
  }
`;

export const getSurvey = `
  query($id: String!, $localeKey: String) {
    getSurvey(id: $id, localeKey: $localeKey) {
      description
      fitResultBody
      fitResultHeader
      id
      name
      noFitResultBody
      noFitResultHeader
      optOutButtonText
      proceedButtonText
    }
  }
`;

export const list = `
  query($localeKey: String) {
    listSurveys(localeKey: $localeKey) {
      description
      id
      name
    }
  }
`;

export const path = "/realistic-job-previews/graphql";
