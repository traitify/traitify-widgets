import {useState} from "react";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useTranslate from "lib/hooks/use-translate";
import {userCompletedFeedbackQuery} from "lib/recoil/feedback";
import Modal from "./modal";
import style from "./style.scss";

export default function Feedback() {
  const userCompletedFeedback = useLoadedValue(userCompletedFeedbackQuery);
  const translate = useTranslate();
  const [showModal, setShowModal] = useState(false);

  if(userCompletedFeedback) { return null; }

  const openModal = () => { setShowModal(true); };
  const closeModal = () => { setShowModal(false); };

  return (
    <div>
      <div className={style.container}>
        <div className={style.details}>
          <span>{translate("feedback_prompt")}</span>
          <div className={style.buttons}>
            <button type="button" className={style.me} onClick={openModal}>{translate("yes")}</button>
            <button type="button" className={style.notMe} onClick={openModal}>{translate("no")}</button>
          </div>
        </div>
      </div>
      {showModal && <Modal closeFn={closeModal} />}
    </div>
  );
}
