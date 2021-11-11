import {sortByTypePosition} from "lib/helpers";
import {times} from "lib/helpers/array";
import {dig} from "lib/helpers/object";

const defaultRanges = [
  {match_score: 5, max_score: 3, min_score: 1},
  {match_score: 10, max_score: 6, min_score: 4},
  {match_score: 20, max_score: 10, min_score: 7}
];

const rankFromRange = ({match_score: score}) => {
  if(score === 5) { return "low"; }
  if(score === 10) { return "medium"; }
  if(score === 20) { return "high"; }

  return "other";
};

export function findCompetency({guide, typeID}) {
  return (dig(guide, "competencies") || [])
    .find(({questionSequences}) => questionSequences[0].personalityTypeId === typeID);
}

export function combine({benchmark, guide, order, types}) {
  const data = sortByTypePosition(types).map(({personality_type: type, score}) => {
    const rawRanges = benchmark
      ? benchmark.range_types.find(({id}) => id === type.id).ranges
      : defaultRanges;
    const ranges = rawRanges.map((range) => ({
      max: range.max_score <= 10 ? range.max_score : 10,
      min: range.min_score > 0 ? range.min_score : 1,
      rank: rankFromRange(range)
    }));
    const range = ranges.find(({max, min}) => score >= min && score <= max);

    return {
      competency: findCompetency({guide, typeID: type.id}),
      rank: range ? range.rank : "other",
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
    const data = Array(10).fill().map(() => ({rank: "other"}));

    ranges.forEach(({max, min, rank}) => {
      times(max - min + 1).forEach((index) => { data[index + min - 1] = {rank}; });
    });

    data[score - 1].active = true;

    return {...column, data, score};
  });
}
