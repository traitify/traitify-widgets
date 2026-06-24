const assessment = `
      completedAt
      id
      isSkipped
      localeKey
      overallScore
      profileId
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
      startedAt
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
      surveyId
      surveyName
      totalCorrectResponses
      totalIncorrectResponses
`.trim();

export const create = `
  mutation($profileID: ID!, $surveyID: ID!) {
    getOrCreateAssessment(profileId: $profileID, surveyId: $surveyID) {
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

export const skip = `
  mutation($id: ID!) {
    skipAssessment(id: $id) {
      ${assessment}
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
      ${assessment}
    }
  }
`;

export const path = "/generic-assessments/graphql";
