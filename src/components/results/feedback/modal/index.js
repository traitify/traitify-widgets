import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {feedbackSurveyQuery} from "lib/recoil/feedback";
import useTranslate from "lib/hooks/use-translate";
import useLoadedValue from "lib/hooks/use-loaded-value";
import Icon from "components/common/icon";
import style from "./style.scss";

export default function FeedbackModal({closeFn}) {
  const feedbackSurvey = useLoadedValue(feedbackSurveyQuery);
  const translate = useTranslate();

  console.log("feedbackSurvey :>> ", feedbackSurvey);
  if(!feedbackSurvey) { return null; }

  const onSubmit = (event) => {
    event.preventDefault();
    const response = new Map(new FormData(event.target).entries());
    console.log("response :>> ", response);
    // TODO send to server
  };

  const multipleChoice = (question) => (
    <div key={question.id}>
      <label htmlFor={question.id} className={style.question}>{question.text}</label>
      <select form="form" className={style.dropdown} id={question.id} name={question.id} defaultValue="">
        <option value="" disabled={true} hidden={true}>Select</option>
        {question.multipleChoiceOptions.map((option) => (
          <option key={option.id} value={option.id}>{option.text}</option>
        ))}
      </select>
    </div>
  );

  const questionFactory = (question) => {
    switch(question.questionType) {
      case "Multiple Choice":
        return multipleChoice(question);
      // case "Short Response":
        // TODO
      default:
        console.error(`Unknown question type: ${question.questionType}`); /* eslint-disable-line no-console */
        return null;
    }
  };

  return (
    <div className={`${style.modal} ${style.container}`}>
      <section className={style.modalContainer}>
        <div className={style.modalContent}>

          <form onSubmit={onSubmit} id="form">

            <div className={style.header}>
              <div>{feedbackSurvey.title}</div>
              <div>
                <Icon
                  aria-label={translate("close")}
                  className={style.close}
                  icon={faTimes}
                  onClick={closeFn}
                  tabIndex="-1"
                />
              </div>
            </div>

            <hr className={style.grayDivider} />

            <div className={style.content}>
              <span>{translate("feedback_modal_prompt")}</span>

              {feedbackSurvey.questions.map(questionFactory)}
            </div>

            <hr className={style.grayDivider} />

            <div className={style.footer}>

              <button className={style.cancelBtn} onClick={closeFn} type="button">
                {translate("cancel")}
              </button>
              <button type="submit" className={style.submitBtn}>{translate("submit")}</button>
            </div>

          </form>

        </div>
      </section>
    </div>
  );
}

FeedbackModal.propTypes = {
  closeFn: PropTypes.func.isRequired
};
