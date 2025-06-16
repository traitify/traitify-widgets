import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import Icon from "components/common/icon";
import useAssessment from "lib/hooks/use-assessment";
import useTranslate from "lib/hooks/use-translate";
import Container from "./container";
import QuestionSet from "./question-set";

export default function Generic() {
  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const assessment = useAssessment({surveyType: "generic"});
  const questionSets = assessment ? assessment.questionSets : [];
  const questionCount = questionSets.reduce((count, questionSet) => count + questionSet.questions.length, 0);
  const currentQuestionSet = questionSets ? questionSets[questionSetIndex] : {};
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const finished = questionSets.length > 0 && questionCount === answers.length;

  const props = {progress};
  const translate = useTranslate();

  const updateAnswer = (questionId, selectedOptionId) => {
    const currentAnswers = answers.filter((answer) => answer.questionId !== questionId);
    setAnswers([...currentAnswers,
      {questionId, selectedResponseOptionId: selectedOptionId}]);
  };

  const next = () => { setQuestionSetIndex(questionSetIndex + 1); };
  const back = () => { setQuestionSetIndex(questionSetIndex - 1); };

  const onSubmit = () => {
    console.log("Submitting answers:", answers);
  };

  useEffect(() => {
    if(!finished) { return; }
    onSubmit();
  }, [finished]);

  return (
    <Container {...props}>
      {currentQuestionSet
        && (
        <QuestionSet
          key={questionSetIndex}
          questionSet={currentQuestionSet}
          updateAnswer={updateAnswer}
          next={next}
        />
        )}

      {questionSetIndex > 0 && (
        <button onClick={back} type="button">
          <Icon alt={translate("back")} icon={faChevronLeft} />
          Back
        </button>
      )}
    </Container>
  );
}
