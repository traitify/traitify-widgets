import {useEffect, useState} from "react";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import Loading from "components/common/loading";
import mutable from "lib/common/object/mutable";
import useUpdateAssessment from "lib/hooks/requests/graphql/use-update-assessment";
import useAssessment from "lib/hooks/use-assessment";
import useComponentEvents from "lib/hooks/use-component-events";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useOption from "lib/hooks/use-option";
import Instructions from "./instructions";
import QuestionSet from "./question-set";
import style from "./style.scss";

export default function GenericSurvey() {
  const assessment = useAssessment({surveyType: "generic"});
  const graphQL = useGraphql();
  const showHelp = useOption("showHelp");
  const {
    attempts: submitAttempts,
    requesting: submitting,
    trigger: submitRequest
  } = useUpdateAssessment({
    key: "generic-submit",
    parse: (response) => response.data,
    path: graphQL.generic.path,
    save: false,
    success: (data) => !!data.updateAssessment
  });

  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [questionSets, setQuestionSets] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const currentQuestionSet = questionSets[questionSetIndex];
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const state = {
    progress,
    questionSets
  };

  const onSubmit = () => {
    const answers = [];
    questionSets.forEach(({questions}) => {
      questions.filter(({answer}) => answer)
        .forEach(({answer, id}) => answers.push({
          questionId: id,
          selectedResponseOptionId: answer.id
        }));
    });

    submitRequest({
      assessment,
      query: graphQL.generic.update,
      variables: {answers, id: assessment.id}
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
