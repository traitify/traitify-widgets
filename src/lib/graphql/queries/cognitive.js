import toQuery from "../to-query";

const defaultFields = [
  "allottedTime",
  "completed",
  "id",
  "localeKey",
  "name",
  "percentileScore",
  "rawScore",
  "specialAllottedTime",
  "surveyId",
  "surveyKey",
  {
    questions: [
      "id",
      {
        answer: ["answerId", "skipped", "timeTaken"],
        questionImage: ["id", "url"],
        responses: ["id", {image: ["id", "url"]}]
      }
    ]
  }
];

export function create({fields: _fields, params}) {
  const fields = _fields || defaultFields;

  if(!params.surveyId) {
    console.warn("GraphQL - createCognitiveTest - Survey ID required"); // eslint-disable-line no-console
  }

  return {
    query: `
      mutation($localeKey: String, $surveyId: String!) {
        createCognitiveTest(localeKey: $localeKey, surveyId: $surveyId) {
          ${toQuery(fields)}
        }
      }
    `,
    variables: params
  };
}

export function get({fields: _fields, params}) {
  const fields = _fields || defaultFields;

  return {
    query: `
      query cognitiveTest($localeKey: String, $testId: String!) {
        cognitiveTest(localeKey: $localeKey, testId: $testId) {
          ${toQuery(fields)}
        }
      }
    `,
    variables: params
  };
}

export function update({fields: _fields, params}) {
  const fields = _fields || ["message", "success"];

  return {
    query: `
      mutation($answers: [QuestionAnswer]!, $overallTimeTaken: Int!, $testId: String!) {
        completeCognitiveTest(answers: $answers, overallTimeTaken: $overallTimeTaken, testId: $testId) {
          ${toQuery(fields)}
        }
      }
    `,
    variables: params
  };
}
