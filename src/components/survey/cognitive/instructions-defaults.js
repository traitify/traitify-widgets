const defaultAnswers = [4, 1, 2];
const urlBase = "https://cdn.traitify.com/images/cognitive";

export const defaultExamples = [
  ({timeTrial, translate}) => ({
    button: translate("cognitive_instructions_step_1_button"),
    heading: translate("cognitive_instructions_step_1_heading"),
    text: translate(timeTrial ? "cognitive_instructions_trial_step_1_text" : "cognitive_instructions_step_1_text")
  }),
  ({translate, type}) => ({
    button: translate("cognitive_instructions_step_2_button"),
    heading: translate("cognitive_instructions_step_2_heading"),
    text: translate("cognitive_instructions_step_2_text"),
    video: `${urlBase}/practice-example-${type}.mp4`
  })
];

export const defaultExplanations = defaultAnswers.map((_, index) => (
  ({translate, type}) => ({
    button: translate(`cognitive_practice_step_${index + 1}_button`),
    heading: translate(`cognitive_practice_step_${index + 1}_heading`),
    text: translate(`cognitive_practice_step_${index + 1}_text`),
    video: `${urlBase}/practice-${index + 1}-${type}.mp4`
  })
));

export const defaultInstruction = ({minimal, timeTrial, timed, translate}) => ({
  button: translate("cognitive_instructions_step_4_button"),
  heading: translate("cognitive_instructions_step_4_heading"),
  text: translate(
    timeTrial
      ? `cognitive_instructions_trial_step_4_${timed ? "timed" : "untimed"}${minimal ? "_minimal" : ""}_html`
      : "cognitive_instructions_step_4_html"
  )
});

export const defaultQuestions = defaultAnswers.map((answer, index) => ({
  correctAnswerID: `r-${index}-${answer}`,
  id: `s-${index}`,
  questionImage: {url: `https://cdn.traitify.com/images/cognitive/practice-question-${index + 1}/question.png`},
  responses: [1, 2, 3, 4].map((response) => ({
    id: `r-${index}-${response}`,
    image: {url: `https://cdn.traitify.com/images/cognitive/practice-question-${index + 1}/response-${response}.png`}
  }))
}));
