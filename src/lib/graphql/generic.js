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
  query($profileID: ID!, $surveyID: ID!) {
    genericAssessmentQuestions(profileId: $profileID, surveyId: $surveyID) {
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
`;

export const update = `
  mutation($profileID: ID!, $surveyID: ID!, $answers: [Answers]!) {
    submitGenericAssessmentAnswers(profileId: $profileID, surveyId: $surveyID, answers: $answers) {
      id
      surveyId
      profileId
      startedAt
      completedAt
    }
  }
`;

export const path = "/generic-assessments/graphql";
