import mutable from "./object/mutable";

export default function sortByTypePosition(types) {
  return mutable(types).sort((x, y) => {
    const xDetail = x.personality_type.details.find(({title}) => title === "Position") || {};
    const yDetail = y.personality_type.details.find(({title}) => title === "Position") || {};

    return (xDetail.body || 1) - (yDetail.body || 1);
  });
}
