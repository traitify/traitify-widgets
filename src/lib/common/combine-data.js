import times from "lib/common/array/times";
import dig from "lib/common/object/dig";
import sortByTypePosition from "lib/common/sort-by-type-position";

const defaultRanks = [
  {color: "#29B770", rank: "high"},
  {color: "#FFCC3B", rank: "medium"},
  {color: "#EF615E", rank: "low"}
];

const defaultRanges = [
  {matchScore: 5, maxScore: 3, minScore: 1},
  {matchScore: 10, maxScore: 6, minScore: 4},
  {matchScore: 20, maxScore: 10, minScore: 7}
];

const rankFromRange = ({matchScore: score}) => {
  if(score === 5) { return "low"; }
  if(score === 10) { return "medium"; }
  if(score === 20) { return "high"; }

  return "other";
};

const findRank = ({range, ranks}) => {
  const key = rankFromRange(range);

  return ranks.find(({rank}) => rank === key) || {color: "black", rank: key};
};

export function findCompetency({guide, typeID}) {
  return (dig(guide, "personality", "competencies") || [])
    .find(({questionSequences}) => dig(questionSequences, 0, "personalityTypeId") === typeID);
}

export function ranksFromBenchmark(benchmark) {
  if(!benchmark) { return defaultRanks; }

  return ["High", "Medium", "Low"].map((rank) => ({
    color: benchmark[`hexColor${rank}`],
    label: benchmark[`hexColor${rank}Label`],
    rank: rank.toLowerCase()
  }));
}

export function combine({benchmark, guide, order, types}) {
  const ranks = ranksFromBenchmark(benchmark);
  const data = sortByTypePosition(types).map(({personality_type: type, score}) => {
    const dimensionRanges = benchmark
      ? benchmark.dimensionRanges.filter(({dimensionId}) => dimensionId === type.id)
      : [];

    const rawRanges = dimensionRanges.length
      ? dimensionRanges
      : defaultRanges;

    const ranges = rawRanges.map((range) => ({
      max: range.maxScore <= 10 ? range.maxScore : 10,
      min: range.minScore > 0 ? range.minScore : 1,
      ...findRank({range, ranks})
    }));
    const range = ranges.find(({max, min}) => score >= min && score <= max);

    return {
      competency: findCompetency({guide, typeID: type.id}),
      rank: range.rank,
      range,
      ranges,
      score,
      type
    };
  });

  if(order === "types") { return data; }

  const sortedData = data.filter(({rank}) => rank === "low");
  sortedData.push(...data.filter(({rank}) => rank === "medium"));
  sortedData.push(...data.filter(({rank}) => rank === "high"));
  sortedData.push(...data.filter(({rank}) => rank === "other"));

  return sortedData;
}

export function createColumns(options) {
  return combine(options).map(({ranges, score, ...column}) => {
    const data = Array(10).fill().map(() => ({color: "black", rank: "other"}));

    ranges.forEach(({color, max, min, rank}) => {
      times(max - min + 1).forEach((index) => { data[index + min - 1] = {color, rank}; });
    });

    data[score - 1].active = true;

    return {...column, data, score};
  });
}
