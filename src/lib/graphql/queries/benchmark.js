import toQuery from "../to-query";

const defaultFields = [
  "allottedTime",
  "completed",
  "id",
  "learningDisability",
  "localeKey",
  "name",
  "percentileScore",
  "rawScore",
  "specialAllottedTime",
  "surveyId",
  "surveyKey",
  {
    dimensionRanges: [
      "id",
      "dimensionId",
      "maxScore",
      "minScore"
    ]
  },
  {
    resultRankings: [
      "description",
      "id",
      "level",
      "maxScore",
      "minScore",
      "visualDescription",
      "visualHex"
    ]
  }
];

export default function benchmarkQuery({fields, params}) {
  // make these default fields and have other fields passed in overwrite it.
  return {
    query: `
      query($benchmarkId: String!, $localeKey: String!) {
        getDimensionRangeBenchmark(benchmarkId: $benchmarkId, localeKey: $localeKey) {
          ${toQuery(fields || defaultFields)}
        }
      }
    `,
    variables: params
  };
}
