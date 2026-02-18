export const create = `
  mutation($profileID: ID!, $surveyID: ID!) {
    getOrCreateGenericAssessment(profileId: $profileID, surveyId: $surveyID) {
      completedAt
      id
      isSkipped
      localeKey
      profileId
      startedAt
      surveyId
      surveyName
    }
  }
`;

export const questions = `
  query($assessmentID: ID!) {
    genericSurveyQuestions(assessmentId: $assessmentID) {
      completedAt
      id
      isSkipped
      localeKey
      overallScore
      profileId
      startedAt
      surveyId
      surveyName
      totalCorrectResponses
      totalIncorrectResponses
      survey {
        conclusions
        id
        instructionButton
        instructions
        name
        questionSets {
          setImage
          text
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
      responses {
        isCorrect
        questionId
        questionText
        selectedResponseOptionId
        setImage
        responseOptions {
          isCorrect
          responseOptionId
          responseOptionText
        }
      }
    }
  }
`;

export const skip = `
  mutation($assessmentID: ID!) {
    skipGenericAssessment(assessmentId: $assessmentID) {
      completedAt
      id
      isSkipped
      localeKey
      overallScore
      profileId
      startedAt
      surveyId
      surveyName
      totalCorrectResponses
      totalIncorrectResponses
      survey {
        conclusions
        id
        instructionButton
        instructions
        name
        questionSets {
          setImage
          text
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
      responses {
        isCorrect
        questionId
        questionText
        selectedResponseOptionId
        setImage
        responseOptions {
          isCorrect
          responseOptionId
          responseOptionText
        }
      }
    }
  }
`;

export const surveys = `
  query($localeKey: String!) {
    genericSurveys(localeKey: $localeKey) {
      id
      name
    }
  }
`;

export const update = `
  mutation($assessmentID: ID!, $answers: [Answers]!) {
    submitGenericAssessmentAnswers(assessmentId: $assessmentID, answers: $answers) {
      completedAt
      id
      isSkipped
      localeKey
      overallScore
      profileId
      startedAt
      surveyId
      surveyName
      totalCorrectResponses
      totalIncorrectResponses
      survey {
        conclusions
        id
        instructionButton
        instructions
        name
        questionSets {
          setImage
          text
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
      responses {
        isCorrect
        questionId
        questionText
        selectedResponseOptionId
        setImage
        responseOptions {
          isCorrect
          responseOptionId
          responseOptionText
        }
      }
    }
  }
`;

export const path = "/generic-assessments/graphql";
