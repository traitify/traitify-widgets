import toQuery from "../to-query";

export function create({fields: _fields, params}) {
  const fields = _fields || [
    "completed", "id", "localeKey", "name", "surveyId", "surveyKey",
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
  const fields = _fields || [
    "completed", "id", "localeKey", "name", "surveyId", "surveyKey",
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
export function update() {}
