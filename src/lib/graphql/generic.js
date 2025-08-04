export const surveys = `
  query($localeKey: String!) {
    genericSurveys(localeKey: $localeKey) {
      id
      name
    }
  }
`;

export const create = `
  mutation($profileID: ID!, $surveyID: ID!) {
    getOrCreateGenericAssessment(profileId: $profileID, surveyId: $surveyID) {
      id
      surveyId
      profileId
      startedAt
      completedAt
    }
  }
`;

export const questions = `
  query($assessmentID: ID!) {
    genericSurveyQuestions(assessmentId: $assessmentID) {
      id
      surveyId
      profileId
      startedAt
      completedAt
      survey {
        id
        name
        conclusions
        instructions
        instructionButton
        questionSets {
          text
          setImage
          questions {
            id
            text
            responseOptions {
              id
              text
            }
          }
        }
      }
    }
  }
`;

export const result = `
  query($assessmentID: ID!) {
    genericAssessmentResult(assessmentId: $assessmentID) {
      profile {
        profileId
        firstName
        lastName
      }
      assessment {
        localeKey
        profileId
        surveyId
        surveyName
        startedAt
        totalCorrectResponses
        completedAt
        responses {
          questionId
          questionText
          selectedResponseOptionId
          setImage
          isCorrect
          responseOptions {
            responseOptionId
            responseOptionText
            isCorrect
          }
        }
      }
    }
  }
`;

export const update = `
  mutation($assessmentID: ID!, $answers: [Answers]!) {
    submitGenericAssessmentAnswers(assessmentId: $assessmentID, answers: $answers) {
      id
      surveyId
      profileId
      startedAt
      completedAt
    }
  }
`;

export const path = "/generic-assessments/graphql";
