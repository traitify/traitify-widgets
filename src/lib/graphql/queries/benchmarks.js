import toNodeID from "../to-node-id";
import toQuery from "../to-query";

export default function benchmarksQuery({fields: _fields, params: {profileID, ..._params}}) {
  const fields = _fields || [
    "assessmentId",
    "description",
    "id",
    "matchScore",
    "recommendationId",
    "visualDescription",
    "visualHexValue"
  ];

  const params = {..._params};
  if(!params.id && profileID) { params.id = toNodeID("Profile", profileID); }

  return {
    query: `
      query getProfile($id: ID!) {
        node(id: $id) {
          id
          ... on Profile {
            assessments { defaultRecommendationId }
            recommendations { ${toQuery(fields)} }
          }
        }
      }
    `,
    variables: params
  };
}
