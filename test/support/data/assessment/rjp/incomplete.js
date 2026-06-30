import base from "./base";

export default {
  ...base,
  completedAt: null,
  responses: [
    {
      id: "rjp-response-1",
      questionId: "rjp-question-1",
      questionText: "Question 1",
      responseOptions: [
        {responseOptionId: "rjp-option-1a", responseOptionText: "Response A"},
        {responseOptionId: "rjp-option-1b", responseOptionText: "Response B"}
      ],
      selectedResponseOptionId: null,
      selectedResponseOptionText: null
    },
    {
      id: "rjp-response-2",
      questionId: "rjp-question-2",
      questionText: "Question 2",
      responseOptions: [
        {responseOptionId: "rjp-option-2a", responseOptionText: "Response A"},
        {responseOptionId: "rjp-option-2b", responseOptionText: "Response B"}
      ],
      selectedResponseOptionId: null,
      selectedResponseOptionText: null
    }
  ],
  startedAt: "2024-01-01T00:00:00Z"
};
