import toQuery from "../to-query";

const defaultFields = [
  "benchmarkId",
  "default",
  "hexColorHigh",
  "hexColorMedium",
  "hexColorLow",
  "name",
  "orgPath",
  {
    dimensionRanges: [
      "id",
      "dimensionId",
      "matchScore",
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
