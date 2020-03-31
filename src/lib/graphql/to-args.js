import obj2arg from "graphql-obj2arg";

export default function toArgs(query) {
  return obj2arg(query, {noOuterBraces: true});
}
