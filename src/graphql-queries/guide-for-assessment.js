import gql from "graphql-tag";

// try w full object -
// then try other ideas
export default gql`{
  query GuideForAssessment($assessment: Assessment!) {
    guideForAssessment(assessment: $assessment, localeKey: "en-us") {
      id
      name
      deckId
    }
  }
`;

// export default gql`{
//   guideForAssessment(assessment: {
//        id: "29b89abe-0be1-4be4-aa3b-43773ebe8ecf"
//        deckId: "big-five"
//        personalityTypes: [
//         {
//                      personalityType: {
//             id: "f087aa70-14ea-4293-9327-cedf0e4ce1fa"
//             level: "High"
//           }
//         },
//         {
//                      personalityType: {
//             id: "462b8063-69f4-4b50-990b-8daee93e8616"
//             level: "Medium"
//           }
//         },
//         {
//                      personalityType: {
//             id: "2835d442-98be-49ff-9cf1-0e0ea577fa77"
//             level: "Medium"
//           }
//         },
//         {
//                      personalityType: {
//             id: "f702b455-2c0e-433c-a274-b01b68ae29ba"
//             level: "Medium"
//           }
//         },
//         {
//                      personalityType: {
//             id: "05596127-4fdd-4d22-8ae7-530d42d225eb"
//             level: "Low"
//           }
//         }
//       ]
//     }, localeKey: "en-us") {
//     id
//     name
//     deckId
//     competencies {
//       id
//       name
//       introduction
//       order
//       questionSequences {
//         id
//         name
//         questions {
//           id
//           text
//           adaptability
//           order
//         }
//       }
//     }
//   }
// }
// `;
