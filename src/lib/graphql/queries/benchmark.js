export default function benchmarkQuery(params) {
  // make these default fields and have other fields passed in overwrite it.
  return {
    query: `
      query($benchmarkId: String!, $localeKey: String!) {
        getDimensionRangeBenchmark(benchmarkId: $benchmarkId, localeKey: $localeKey) {
          benchmarkId
          default
          dimensionRanges {
            id
            dimensionId
            matchScore
            maxScore
            minScore
          }
          hexColorHigh
          hexColorMedium
          hexColorLow
          name
          orgPath
          resultRankings {
            description
            id
            level
            maxScore
            minScore
            visualDescription
            visualHex
          }
        }
      }
    `,
    variables: params
  };
}
