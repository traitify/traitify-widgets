import base from "./base";

export default {
  ...base,
  completedAt: "2024-01-01T00:00:00Z",
  overallScore: 1,
  survey: {
    conclusions: "## Conclusions",
    id: "generic-survey-xyz",
    instructionButton: "Get Started",
    instructions: "## Instructions",
    name: "generic-survey-name",
    questionSets: [
      {
        setImage: "https://cdn.traitify.com/generic/set1.png",
        text: "Question Set 1",
        questions: [
          {
            id: "question-1",
            text: "Question 1",
            responseOptions: [
              {id: "response-1a", text: "Response A"},
              {id: "response-1b", text: "Response B"}
            ]
          }
        ]
      },
      {
        setImage: "https://cdn.traitify.com/generic/set2.png",
        text: "Question Set 2",
        questions: [
          {
            id: "question-2",
            text: "Question 2",
            responseOptions: [
              {id: "response-2a", text: "Response A"},
              {id: "response-2b", text: "Response B"}
            ]
          }
        ]
      }
    ]
  },
  responses: [
    {
      isCorrect: true,
      questionId: "question-1",
      questionText: "Question 1",
      responseOptions: [
        {isCorrect: true, responseOptionId: "response-1a", responseOptionText: "Response A"},
        {isCorrect: false, responseOptionId: "response-1b", responseOptionText: "Response B"}
      ],
      selectedResponseOptionId: "response-1a",
      setImage: "https://cdn.traitify.com/generic/set1.png"
    },
    {
      isCorrect: false,
      questionId: "question-2",
      questionText: "Question 2",
      responseOptions: [
        {isCorrect: true, responseOptionId: "response-2a", responseOptionText: "Response A"},
        {isCorrect: false, responseOptionId: "response-2b", responseOptionText: "Response B"}
      ],
      selectedResponseOptionId: "response-2b"
    }
  ],
  totalCorrectResponses: 1,
  totalIncorrectResponses: 1
};
