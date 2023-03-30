export const create = `
  mutation($localeKey: String, $surveyID: String!) {
    createCognitiveTest(localeKey: $localeKey, surveyId: $surveyID) {
      allottedTime
      completed
      id
      learningDisability
      localeKey
      name
      percentileScore
      rawScore
      specialAllottedTime
      surveyId
      surveyKey
      questions {
        id
        answer {
          answerId
          skipped
          timeTaken
        }
        questionImage {
          id
          url
        }
        responses {
          id
          image {
            id
            url
          }
        }
      }
    }
  }
`;
export const surveys = `
  query($first: Int = 50) {
    cognitiveSurveys(first: $first) {
      edges {
        node {
          id
          key
          name
        }
      }
    }
  }
`;

export const path = "/cognitive-tests/graphql";
