export const get = `
  query($id: ID!) {
    order(id: $id) {
      assessments {
        id
        status
        surveyId
        type
      }
      defaultLocaleKey
      errorMessage
      id
      orgPath
      packageId
      profileId
      requirements {
        surveys { id type }
      }
      status
    }
  }
`;

export const path = "/orders/graphql";
