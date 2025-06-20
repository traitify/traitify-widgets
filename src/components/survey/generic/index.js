import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import Icon from "components/common/icon";
import Markdown from "components/common/markdown";
import Modal from "components/common/modal";
import useAssessment from "lib/hooks/use-assessment";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useTranslate from "lib/hooks/use-translate";
import Container from "./container";
import QuestionSet from "./question-set";
import style from "./style.scss";

export default function Generic() {
  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConclusions, setShowConclusions] = useState(false);

  const assessment = useAssessment({surveyType: "generic"});
  const questionSets = assessment ? assessment.questionSets : [];
  const questionCount = questionSets.reduce((count, set) => count + set.questions.length, 0);
  const currentQuestionSet = questionSets ? questionSets[questionSetIndex] : {};
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const finished = questionSets.length > 0 && questionCount === answers.length;

  const graphQL = useGraphql();
  const http = useHttp();
  const translate = useTranslate();
  const props = {progress};

  const updateAnswer = (questionId, selectedOptionId) => {
    const currentAnswers = answers.filter((answer) => answer.questionId !== questionId);
    setAnswers([...currentAnswers,
      {questionId, selectedResponseOptionId: selectedOptionId}]);
  };

  const next = () => { setQuestionSetIndex(questionSetIndex + 1); };
  const back = () => { setQuestionSetIndex(questionSetIndex - 1); };

  const onSubmit = () => {
    const query = graphQL.generic.update;
    const variables = {
      assessmentID: assessment.assessment.id,
      answers
    };

    http.post(graphQL.generic.path, {query, variables}).then(({data, errors}) => {
      if(!errors && data.submitGenericAssessmentAnswers) {
        setShowConclusions(true);
      } else {
        console.warn(errors || data); // eslint-disable-line no-console

        // setTimeout(() => setSubmitAttempts((x) => x + 1), 2000);
      }
    });
  };

  useEffect(() => {
    setShowInstructions(true);
  }, [assessment]);

  useEffect(() => {
    if(!finished) { return; }
    onSubmit();
  }, [finished]);

  if(showConclusions) {
    return (
      <Container {...props}>
        <Markdown className={style.markdown}>
          {assessment.conclusions}
        </Markdown>
        <button type="button" className={style.btnPrimary}>Finished!</button>
      </Container>
    );
  }

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
        <button onClick={back} type="button" className={style.back}>
          <Icon className={style.icon} alt={translate("back")} icon={faArrowLeft} />
          Go Back
        </button>
      )}
      {showInstructions
        && (
          <Modal
            title="Instructions"
            onClose={() => setShowInstructions(false)}
            containerClass={style.modalContainer}
          >
            <Markdown>
              {assessment.instructions}
            </Markdown>
            <hr className={style.grayDivider} />
            <div className={style.footer}>
              <button
                type="button"
                className={style.cancelBtn}
                onClick={() => setShowInstructions(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={style.btnPrimary}
                onClick={() => setShowInstructions(false)}
              >
                {assessment.instructionButton}
              </button>
            </div>
          </Modal>
        )}
    </Container>
  );
}
