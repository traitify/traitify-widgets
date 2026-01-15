import {useState} from "react";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {userCompletedFeedbackQuery, feedbackSurveyQuery} from "lib/recoil/feedback";
import Modal from "./modal";
import style from "./style.scss";

export default function Feedback() {
  const userCompletedFeedback = useLoadedValue(userCompletedFeedbackQuery);
  const feedbackSurvey = useLoadedValue(feedbackSurveyQuery);
  const translate = useTranslate();
  const perspective = useOption("perspective");
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if(!feedbackSurvey) { return null; }
  if(userCompletedFeedback) { return null; }
  if(perspective !== "firstPerson") { return null; }

  const openModal = () => { setShowModal(true); };
  const closeModal = ({submitted: _submitted}) => {
    setShowModal(false);

    if(_submitted) { setSubmitted(true); }
  };

  if(submitted) {
    return (
      <div>
        <div className={style.container}>
          <div className={style.details}>
            <span>{translate("feedback.thanks")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.details}>
          <span>{translate("feedback.prompt")}</span>
          <div className={style.buttons}>
            <button type="button" className={style.me} onClick={openModal}>{translate("yes")}</button>
            <button type="button" className={style.notMe} onClick={openModal}>{translate("no")}</button>
          </div>
        </div>
      </div>
      {showModal && <Modal onClose={closeModal} />}
    </>
  );
}
