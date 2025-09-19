import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import Icon from "components/common/icon";
import Loading from "components/common/loading";
import Markdown from "components/common/markdown";
import Modal from "components/common/modal";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useTranslate from "lib/hooks/use-translate";
import {activeAssessmentQuery} from "lib/recoil";
import Container from "./container";
import QuestionSet from "./question-set";
import style from "./style.scss";

export default function GenericSurvey() {
  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConclusions, setShowConclusions] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const assessment = useAssessment({surveyType: "generic"});
  if(assessment?.completedAt) { return; }
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const questionSets = assessment ? assessment.survey.questionSets : [];
  const questionCount = questionSets.reduce((count, set) => count + set.questions.length, 0);
  const currentQuestionSet = questionSets ? questionSets[questionSetIndex] : {};
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const finished = questionSets.length > 0 && questionCount === answers.length;

  const graphQL = useGraphql();
  const http = useHttp();
  const translate = useTranslate();
  const props = {progress};
  const refreshAssessment = useRecoilRefresher(activeAssessmentQuery);

  const updateAnswer = (questionId, selectedOptionId) => {
    const currentAnswers = answers.filter((answer) => answer.questionId !== questionId);
    setAnswers([...currentAnswers,
      {questionId, selectedResponseOptionId: selectedOptionId}]);
  };

  const onNext = () => { setQuestionSetIndex(questionSetIndex + 1); };
  const onBack = () => { setQuestionSetIndex(questionSetIndex - 1); };

  const onSubmit = () => {
    if(submitAttempts > 3) { return; }
    const query = graphQL.generic.update;
    const variables = {
      assessmentID: assessment.id,
      answers
    };

    http.post(graphQL.generic.path, {query, variables}).then(({data, errors}) => {
      if(!errors && data.submitGenericAssessmentAnswers) {
        setShowConclusions(true);
        setTimeout(() => {
          const response = data.submitGenericAssessmentAnswers;
          cache.set(assessmentCacheKey, {...response, completed: true});
          refreshAssessment();
        }, 5000);
      } else {
        console.warn(errors || data); // eslint-disable-line no-console

        setTimeout(() => setSubmitAttempts((x) => x + 1), 2000);
      }
    });
  };

  useDidUpdate(() => { onSubmit(); }, [submitAttempts]);

  useEffect(() => {
    setShowInstructions(true);
  }, [assessment]);

  useEffect(() => {
    if(!finished) { return; }
    onSubmit();
  }, [finished]);

  if(!assessment) { return <Loading />; }

  if(showConclusions) {
    return (
      <Container {...props}>
        <Markdown className={style.markdown}>
          {assessment.survey.conclusions}
        </Markdown>
        <button type="button" className={style.btnPrimary}>Finished!</button>
      </Container>
    );
  }

  return (
    <Container {...props}>
      {currentQuestionSet && (
        <QuestionSet
          key={questionSetIndex}
          questionSet={currentQuestionSet}
          updateAnswer={updateAnswer}
          onNext={onNext}
        />
      )}

      {questionSetIndex > 0 && (
        <button onClick={onBack} type="button" className={style.back}>
          <Icon className={style.icon} alt={translate("back")} icon={faArrowLeft} />
          {translate("back")}
        </button>
      )}
      {showInstructions && (
        <Modal
          title={translate("instructions")}
          onClose={() => setShowInstructions(false)}
          containerClass={style.modalContainer}
        >
          <Markdown>
            {assessment.survey.instructions}
          </Markdown>
          <div className={style.grayDivider} />
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
              {assessment.survey.instructionButton}
            </button>
          </div>
        </Modal>
      )}
    </Container>
  );
}
