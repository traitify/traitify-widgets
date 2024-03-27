import PropTypes from "prop-types";
import Modal from "components/common/modal";
import useAssessment from "lib/hooks/use-assessment";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useTranslate from "lib/hooks/use-translate";
import {feedbackSurveyQuery} from "lib/recoil/feedback";
import style from "./style.scss";

const multipleChoice = (question) => (
  <div key={question.id} className={style.questionSection}>
    <label className={style.question} htmlFor={question.id}>{question.text}</label>
    <select defaultValue="" id={question.id} name={question.id}>
      <option disabled={true} hidden={true} value="">Select</option>
      {question.multipleChoiceOptions.map((option) => (
        <option key={option.id} value={option.id}>{option.text}</option>
      ))}
    </select>
  </div>
);

const shortResponse = (question) => (
  <div key={question.id} className={style.questionSection}>
    <label className={style.question} htmlFor={question.id}>{question.text}</label>
    <textarea id={question.id} name={question.id} rows="5" />
  </div>
);

const questionFactory = (question) => {
  switch(question.questionType) {
    case "Multiple Choice":
      return multipleChoice(question);
    case "Short Response":
      return shortResponse(question);
    default:
      console.error(`Unknown question type: ${question.questionType}`); /* eslint-disable-line no-console */
      throw new Error("Unknown question type");
  }
};

const buildFeedbackSurveyResponse = (questionType, questionId, answer) => {
  switch(questionType) {
    case "Multiple Choice":
      return {
        question_id: questionId,
        selected_option_id: answer
      };
    case "Short Response":
      return {
        question_id: questionId,
        short_response: answer
      };
    default:
      console.error(`Unknown question type: ${questionType}`); /* eslint-disable-line no-console */
      throw new Error("Unknown question type");
  }
};

const buildFeedbackSurveyRequest = (assessment, feedbackSurvey, responseMap) => ({
  profile_id: assessment.profile_ids[0],
  assessment_survey_id: assessment.id,
  assessment_survey_key: assessment.deck_id,
  assessment_survey_type: assessment.assessment_type,
  feedback_survey_id: feedbackSurvey.id,
  locale_key: assessment.locale_key,
  responses: Array.from(responseMap).map(([questionId, answer]) => {
    const {questionType} = feedbackSurvey.questions.find((q) => q.id === questionId);
    return buildFeedbackSurveyResponse(questionType, questionId, answer);
  })
});

export default function FeedbackModal({closeFn}) {
  const feedbackSurvey = useLoadedValue(feedbackSurveyQuery);
  const assessment = useAssessment();
  const translate = useTranslate();
  if(!feedbackSurvey) { return null; }

  const onSubmit = (event) => {
    event.preventDefault();
    const responseMap = new Map(new FormData(event.target).entries());
    const request = buildFeedbackSurveyRequest(assessment, feedbackSurvey, responseMap);
    console.log("request :>> ", request);
    // TODO send to server
  };

  return (
    <Modal
      closeFn={closeFn}
      title={feedbackSurvey.title}
    >
      <form className={style.form} id={feedbackSurvey.id} onSubmit={onSubmit}>
        <span>{translate("feedback_modal_prompt")}</span>
        {feedbackSurvey.questions.map(questionFactory)}
      </form>
      <hr className={style.grayDivider} />
      <div className={style.footer}>
        <button className={style.cancelBtn} onClick={closeFn} type="button">
          {translate("cancel")}
        </button>
        <button type="submit" className={style.submitBtn} form={feedbackSurvey.id}>{translate("submit")}</button>
      </div>
    </Modal>
  );
}

FeedbackModal.propTypes = {
  closeFn: PropTypes.func.isRequired
};
