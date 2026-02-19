import {useEffect, useRef, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher, useSetRecoilState} from "recoil";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import Loading from "components/common/loading";
import {responseToErrors} from "lib/common/errors";
import mutable from "lib/common/object/mutable";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useOption from "lib/hooks/use-option";
import {activeAssessmentQuery, appendErrorState} from "lib/recoil";
import Instructions from "./instructions";
import QuestionSet from "./question-set";
import style from "./style.scss";

export default function GenericSurvey() {
  const appendError = useSetRecoilState(appendErrorState);
  const assessment = useAssessment({surveyType: "generic"});
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const graphQL = useGraphql();
  const http = useHttp();
  const refreshAssessment = useRecoilRefresher(activeAssessmentQuery);
  const showHelp = useOption("showHelp");

  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [questionSets, setQuestionSets] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const submitting = useRef(false);

  const currentQuestionSet = questionSets[questionSetIndex];
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const state = {
    progress,
    questionSets
  };

  const onSubmit = () => {
    if(assessment.completedAt) { return; }
    if(submitAttempts > 3) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    const answers = [];
    questionSets.forEach(({questions}) => {
      questions.filter(({answer}) => answer)
        .forEach(({answer, id}) => answers.push({
          questionId: id,
          selectedResponseOptionId: answer.id
        }));
    });
    const query = graphQL.generic.update;
    const variables = {answers, assessmentID: assessment.id};

    http.post(graphQL.generic.path, {query, variables}).then((response) => {
      const {data, errors} = response;

      if(!errors && data.submitGenericAssessmentAnswers) {
        cache.remove(assessmentCacheKey);
        refreshAssessment();

        submitting.current = false;
      } else {
        console.warn(errors || data); // eslint-disable-line no-console
        appendError(responseToErrors({method: "POST", path: graphQL.generic.path, response}));

        submitting.current = false;

        setTimeout(() => setSubmitAttempts((x) => x + 1), 2000);
      }
    });
  };

  useComponentEvents("Survey", {...state});
  useDidUpdate(() => { onSubmit(); }, [submitAttempts]);
  useEffect(() => { setShowInstructions(true); }, [assessment]);
  useEffect(() => {
    setQuestionSets(assessment?.survey?.questionSets || []);
  }, [assessment]);

  if(!assessment || submitting.current) { return <Loading />; }
  if(assessment.completedAt) { return; }

  const lastSet = questionSetIndex === questionSets.length - 1;
  const onNext = () => {
    const completed = currentQuestionSet.questions.every(({answer}) => answer);
    if(!completed) { return; }

    lastSet ? onSubmit() : setQuestionSetIndex(questionSetIndex + 1);
  };
  const updateAnswer = ({answer, question}) => {
    setQuestionSets((_sets) => {
      const sets = mutable(_sets);
      const setIndex = questionSetIndex;
      const questionIndex = sets[setIndex].questions.findIndex(({id}) => id === question.id);
      sets[setIndex].questions[questionIndex].answer = answer;

      return sets;
    });
  };

  return (
    <div className={style.container}>
      <div className={style.status}>
        {questionSets.length > 1 && (
          <div className={style.progressBar}>
            <div className={style.progress} style={{width: `${progress}%`}} />
          </div>
        )}
        {showHelp && <HelpButton onClick={() => setShowHelpModal(true)} />}
      </div>
      {currentQuestionSet && (
        <QuestionSet
          key={questionSetIndex}
          first={questionSetIndex === 0}
          last={lastSet}
          onBack={() => setQuestionSetIndex(questionSetIndex - 1)}
          onNext={onNext}
          set={currentQuestionSet}
          updateAnswer={updateAnswer}
        />
      )}
      {showInstructions && (
        <Instructions assessment={assessment} onClose={() => setShowInstructions(false)} />
      )}
      {showHelpModal && <HelpModal setShow={setShowHelpModal} show={showHelpModal} />}
    </div>
  );
}
