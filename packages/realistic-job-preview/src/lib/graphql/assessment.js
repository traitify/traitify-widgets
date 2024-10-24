export const create = `
  mutation createAssessment(
    $localeKey: String!,
    $profileID: String!,
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
  query assessment(
    $assessmentID: ID!
  ) {
    assessment(
      id: $assessmentID
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

export const path = "/realistic-job-previews/graphql";

export const start = `
  mutation startAssessment(
    $assessmentID: ID!
  ) {
    startAssessment(
      id: $assessmentID
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

export const update = `
  mutation updateAssessmentAnswer(
    $answers: [AssessmentAnswer],
    $assessmentID: String!
  ) {
    updateAssessmentAnswer(
      answers: $answers,
      assessmentId: $assessmentID
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
