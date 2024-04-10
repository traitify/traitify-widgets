import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Modal from "components/common/modal";
import {isResponsesValid, submitFeedbackSurveyResponse} from "components/results/feedback/feedback-survey";
import useAssessment from "lib/hooks/use-assessment";
import useHttp from "lib/hooks/use-http";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useTranslate from "lib/hooks/use-translate";
import {feedbackSurveyQuery} from "lib/recoil/feedback";
import Question from "./question";
import style from "./style.scss";

const buildFeedbackSurveyResponse = (assessment, feedbackSurvey, responseMap) => ({
  profile_id: assessment.profile_ids[0],
  assessment_survey_id: assessment.id,
  assessment_survey_key: assessment.deck_id,
  assessment_survey_type: assessment.assessment_type,
  feedback_survey_id: feedbackSurvey.id,
  locale_key: assessment.locale_key,
  responses: Object.values(responseMap)
});

export default function FeedbackModal({onClose}) {
  const feedbackSurvey = useLoadedValue(feedbackSurveyQuery);
  const assessment = useAssessment();
  const translate = useTranslate();
  const http = useHttp();
  const [responses, setResponses] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = isResponsesValid(responses);
    setIsValid(valid);
  }, [responses]);

  if(!feedbackSurvey) { return null; }

  const onChange = (resp) => {
    setResponses((prev) => ({...prev, [resp.question_id]: resp}));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const response = buildFeedbackSurveyResponse(assessment, feedbackSurvey, responses);
    submitFeedbackSurveyResponse(assessment.id, response, http);
    onClose({isSubmitting: true});
  };

  return (
    <Modal
      onClose={onClose}
      title={feedbackSurvey.title}
    >
      <form className={style.form} id={feedbackSurvey.id} onSubmit={onSubmit}>
        <span>{translate("feedback_modal_prompt")}</span>
        {feedbackSurvey.questions.map((q) => (
          <Question
            key={q.id}
            question={q}
            onChange={onChange}
          />
        ))}
      </form>
      <hr className={style.grayDivider} />
      <div className={style.footer}>
        <button className={style.cancelBtn} onClick={onClose} type="button">
          {translate("cancel")}
        </button>
        <button type="submit" className={style.submitBtn} disabled={!isValid} form={feedbackSurvey.id}>{translate("submit")}</button>
      </div>
    </Modal>
  );
}

FeedbackModal.propTypes = {
  onClose: PropTypes.func.isRequired
};
