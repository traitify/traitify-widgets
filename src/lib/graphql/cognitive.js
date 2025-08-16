export const create = `
  mutation($localeKey: String, $surveyID: String!) {
    createCognitiveTest(localeKey: $localeKey, surveyId: $surveyID) {
      allottedTime
      completed
      id
      isSkipped
      learningDisability
      localeKey
      name
      percentileScore
      profileId
      rawScore
      specialAllottedTime
      stenScore
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
      isSkipped
      learningDisability
      localeKey
      name
      percentileScore
      profileId
      rawScore
      specialAllottedTime
      stenScore
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

export const skip = `
  mutation($testID: String!) {
    skipCognitiveTest(testId: $testID) {
      message
      success
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
