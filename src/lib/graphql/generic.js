export const surveys = `
  query($localeKey: String!) {
    genericAssessments(localeKey: $localeKey) {
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
    genericAssessmentQuestions(assessmentId: $assessmentID) {
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
      assessment {
        id
        surveyId
        profileId
        startedAt
        completedAt
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
