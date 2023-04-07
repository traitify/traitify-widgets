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

export const get = `
  query cognitiveTest($localeKey: String, $testID: String!) {
    cognitiveTest(localeKey: $localeKey, testId: $testID) {
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

export const update = `
  mutation(
    $answers: [QuestionAnswer]!,
    $learningDisability: Boolean,
    $overallTimeTaken: Int!,
    $testID: String!
  ) {
    completeCognitiveTest(
      answers: $answers,
      learningDisability: $learningDisability,
      overallTimeTaken: $overallTimeTaken,
      testId: $testID
    ) {
      message
      success
    }
  }
`;

export const path = "/cognitive-tests/graphql";
