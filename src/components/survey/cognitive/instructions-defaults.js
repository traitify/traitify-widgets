const defaultAnswers = [4, 1, 2];
const urlBase = "https://cdn.traitify.com/images/cognitive";

export const defaultExamples = [
  ({timeTrial, translate}) => ({
    button: translate("survey.cognitive.instructions.step_1_button"),
    heading: translate("survey.cognitive.instructions.step_1_heading"),
    text: translate(timeTrial ? "survey.cognitive.instructions.trial_step_1_text" : "survey.cognitive.instructions.step_1_text")
  }),
  ({translate, type}) => ({
    button: translate("survey.cognitive.instructions.step_2_button"),
    heading: translate("survey.cognitive.instructions.step_2_heading"),
    text: translate("survey.cognitive.instructions.step_2_text"),
    video: `${urlBase}/practice-example-${type}.mp4`
  })
];

export const defaultExplanations = defaultAnswers.map((_, index) => (
  ({translate, type}) => ({
    button: translate(`survey.cognitive.practice.step_${index + 1}_button`),
    heading: translate(`survey.cognitive.practice.step_${index + 1}_heading`),
    text: translate(`survey.cognitive.practice.step_${index + 1}_text`),
    video: `${urlBase}/practice-${index + 1}-${type}.mp4`
  })
));

export const defaultInstruction = ({id, minimal, timeTrial, timed, translate}) => {
  const getInstructions = () => {
    if(!id) { return "survey.cognitive.instructions.step_4_html"; }

    const specificInstructions = translate(`survey.cognitive.instructions.by_id.${id}`);
    return specificInstructions ? `survey.cognitive.instructions.by_id.${id}` : "survey.cognitive.instructions.step_4_html";
  };

  return {
    button: translate("survey.cognitive.instructions.step_4_button"),
    heading: translate("survey.cognitive.instructions.step_4_heading"),
    text: translate(
      timeTrial
        ? `survey.cognitive.instructions.trial_step_4_${timed ? "timed" : "untimed"}${minimal ? "_minimal" : ""}_html`
        : getInstructions()
    )
  };
};

export const defaultQuestions = defaultAnswers.map((answer, index) => ({
  correctAnswerID: `r-${index}-${answer}`,
  id: `s-${index}`,
  questionImage: {url: `https://cdn.traitify.com/images/cognitive/practice-question-${index + 1}/question.png`},
  responses: [1, 2, 3, 4].map((response) => ({
    id: `r-${index}-${response}`,
    image: {url: `https://cdn.traitify.com/images/cognitive/practice-question-${index + 1}/response-${response}.png`}
  }))
}));
