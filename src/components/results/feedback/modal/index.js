import PropTypes from "prop-types";
import {useMemo, useState} from "react";
import {useSetRecoilState} from "recoil";
import Modal from "components/common/modal";
import {responseToErrors} from "lib/common/errors";
import isBlank from "lib/common/string/is-blank";
import useAssessment from "lib/hooks/use-assessment";
import useHttp from "lib/hooks/use-http";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useTranslate from "lib/hooks/use-translate";
import {appendErrorState, feedbackSurveyQuery} from "lib/recoil";
import Question from "./question";
import style from "./style.scss";

function FeedbackModal({onClose}) {
  const appendError = useSetRecoilState(appendErrorState);
  const feedbackSurvey = useLoadedValue(feedbackSurveyQuery);
  const assessment = useAssessment();
  const translate = useTranslate();
  const http = useHttp();
  const [responses, setResponses] = useState({});
  const valid = useMemo(() => {
    const values = Object.values(responses);
    if(values.length === 0) { return false; }

    return values.every((response) => (
      !isBlank(response.selected_option_id) || !isBlank(response.short_response)
    ));
  }, [responses]);

  if(!feedbackSurvey) { return null; }

  const onChange = (response) => {
    setResponses((prev) => ({...prev, [response.question_id]: response}));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const params = {
      profile_id: assessment.profile_ids[0],
      assessment_survey_id: assessment.id,
      assessment_survey_key: assessment.deck_id,
      assessment_survey_type: assessment.assessment_type,
      feedback_survey_id: feedbackSurvey.id,
      locale_key: assessment.locale_key,
      responses: Object.values(responses)
    };
    const path = `/feedback/assessments/${assessment.id}`;

    http.post(path, params).catch((response) => {
      console.error("Failed to submit feedback survey response", response); /* eslint-disable-line no-console */
      appendError(responseToErrors({method: "POST", path, response}));
    }).then(() => { onClose({submitted: true}); });
  };

  return (
    <Modal
      onClose={onClose}
      title={feedbackSurvey.title}
    >
      <form className={style.form} id={feedbackSurvey.id} onSubmit={onSubmit}>
        <span>{translate("feedback.modal_prompt")}</span>
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
        <button type="submit" className={style.submitBtn} disabled={!valid} form={feedbackSurvey.id}>{translate("submit")}</button>
      </div>
    </Modal>
  );
}

FeedbackModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default FeedbackModal;
