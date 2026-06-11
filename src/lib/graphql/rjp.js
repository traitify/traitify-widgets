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
      completedAt
      failedReason
      id
      insertedAt
      instructions
      isFit
      jobId
      localeKey
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
    }
  }
`;

export const get = `
  query($id: ID!) {
    assessment(id: $id) {
      completedAt
      failedReason
      id
      insertedAt
      instructions
      isFit
      jobId
      localeKey
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
    }
  }
`;

export const start = `
  mutation($id: ID!) {
    startAssessment(id: $id) {
      completedAt
      failedReason
      id
      insertedAt
      instructions
      isFit
      jobId
      localeKey
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
    }
  }
`;

export const update = `
  mutation(
    $answers: [AssessmentAnswer],
    $id: String!
  ) {
    updateAssessmentAnswer(
      answers: $answers,
      assessmentId: $id
    ) {
      completedAt
      failedReason
      id
      insertedAt
      instructions
      isFit
      jobId
      localeKey
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
    }
  }
`;

export const list = `
  query($localeKey: String) {
    realisticJobPreviews(localeKey: $localeKey) {
      description
      id
      name
    }
  }
`;

export const path = "/realistic-job-previews/graphql";
