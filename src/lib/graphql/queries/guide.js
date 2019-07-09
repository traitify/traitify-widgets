import GraphQL from "../client";

export default function guideQuery(guideDetails = {}) {
  const {params} = guideDetails;
  let {fields} = guideDetails;

  const defaultFields = [
    "deckId", "id", "name",
    {competencies: ["id", "name", "introduction", "order", {questionSequences: ["id", "name", {questions: ["id", "text", "adaptability", "order", "purpose"]}]}]}
  ];
  fields = (fields === undefined ? defaultFields : fields);

  const graphql = new GraphQL();
  return `{ guide(${graphql.toArgs(params)}) { ${graphql.toQuery(fields)} }}`;
}
