import {useEffect, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import Loading from "components/common/loading";
import Markdown from "components/common/markdown";
import mutable from "lib/common/object/mutable";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useOption from "lib/hooks/use-option";
import {activeAssessmentQuery} from "lib/recoil";
import Instructions from "./instructions";
import QuestionSet from "./question-set";
import style from "./style.scss";

export default function GenericSurvey() {
  const assessment = useAssessment({surveyType: "generic"});
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const graphQL = useGraphql();
  const http = useHttp();
  const refreshAssessment = useRecoilRefresher(activeAssessmentQuery);
  const showHelp = useOption("showHelp");

  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [questionSets, setQuestionSets] = useState([]);
  const [showConclusions, setShowConclusions] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  useEffect(() => {
    setQuestionSets(assessment?.survey?.questionSets || []);
  }, [assessment]);

  const currentQuestionSet = questionSets[questionSetIndex];
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const state = {
    progress,
    questionSets
  };

  const onSubmit = () => {
    if(submitAttempts > 3) { return; }

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

    http.post(graphQL.generic.path, {query, variables}).then(({data, errors}) => {
      if(!errors && data.submitGenericAssessmentAnswers) {
        // TODO: Remove
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

  useComponentEvents("Survey", {...state});
  useDidUpdate(() => { onSubmit(); }, [submitAttempts]);
  useEffect(() => { setShowInstructions(true); }, [assessment]);

  if(!assessment) { return <Loading />; }
  if(assessment.completedAt) { return; }

  // NOTE: Probably extract this into the results for candidates
  if(showConclusions) {
    return (
      <div className={`${style.container}`}>
        <Markdown className={style.markdown}>
          {assessment.survey.conclusions}
        </Markdown>
      </div>
    );
  }

  const lastSet = questionSetIndex === questionSets.length - 1;
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
          onNext={lastSet ? onSubmit : () => setQuestionSetIndex(questionSetIndex + 1)}
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
