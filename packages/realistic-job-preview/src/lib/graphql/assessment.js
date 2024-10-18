export const create = `
  mutation(
    $jobID: String!,
    $localeKey: String!,
    $profileID: String!
  ) {
    createRealisticJobPreviewAssessment(
      jobId: $jobID,
      localeKey: $localeKey,
      profileId: $profileID
    ) {
      completedAt
      id
      insertedAt
      instructions
      jobId
      localeKey
      minCorrectResponseToFit
      profileId
      responses {
        id
        isCorrectResponse
        isQuestionRequired
        questionId
        questionText
        responseOptions {
          isCorrect
          responseOptionId
          responseOptionText
        }
        rjpAssessmentId
        selectedResponseOptionId
        selectedResponseOptionText
      }
      rjpId
      rjpVideoUrls {
        thumbnailUrl
        videoUrl
      }
      startedAt
      totalCorrectResponses
      updatedAt
    }
  }
`;

export const get = `
  query(
    $id: String!,
    $localeKey: String!
  ) {
    realisticJobPreviewAssessment(
      id: $id,
      localeKey: $localeKey
    ) {
      completedAt
      id
      insertedAt
      instructions
      jobId
      localeKey
      minCorrectResponseToFit
      profileId
      responses {
        id
        isCorrectResponse
        isQuestionRequired
        questionId
        questionText
        responseOptions {
          isCorrect
          responseOptionId
          responseOptionText
        }
        rjpAssessmentId
        selectedResponseOptionId
        selectedResponseOptionText
      }
      rjpId
      rjpVideoUrls {
        thumbnailUrl
        videoUrl
      }
      startedAt
      totalCorrectResponses
      updatedAt
    }
  }
`;

export const path = "/realistic-job-previews/graphql";

// TODO: Accept responses and startTime
export const update = `
  mutation(
    $jobID: String!,
    $localeKey: String!,
    $profileID: String!
  ) {
    updateRealisticJobPreviewAssessment(
      jobId: $jobID,
      localeKey: $localeKey,
      profileId: $profileID
    ) {
      completedAt
      id
      insertedAt
      instructions
      jobId
      localeKey
      minCorrectResponseToFit
      profileId
      responses {
        id
        isCorrectResponse
        isQuestionRequired
        questionId
        questionText
        responseOptions {
          isCorrect
          responseOptionId
          responseOptionText
        }
        rjpAssessmentId
        selectedResponseOptionId
        selectedResponseOptionText
      }
      rjpId
      rjpVideoUrls {
        thumbnailUrl
        videoUrl
      }
      startedAt
      totalCorrectResponses
      updatedAt
    }
  }
`;
