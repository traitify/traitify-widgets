export const create = `
  mutation($profileID: ID!, $surveyID: ID!) {
    getOrCreateAssessment(profileId: $profileID, surveyId: $surveyID) {
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

export const get = `
  query($id: ID!) {
    getAssessment(id: $id) {
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
  mutation($id: ID!) {
    skipAssessment(id: $id) {
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
    listSurveys(localeKey: $localeKey) {
      id
      name
    }
  }
`;

export const update = `
  mutation($answers: [Answers]!, $id: ID!) {
    updateAssessment(answers: $answers, id: $id) {
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
