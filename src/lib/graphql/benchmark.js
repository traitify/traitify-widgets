export const get = `
  query($benchmarkID: String!, $localeKey: String!) {
    getDimensionRangeBenchmark(
      benchmarkId: $benchmarkID,
      localeKey: $localeKey
    ) {
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
`;

export const path = "/recommendations/graphql";
