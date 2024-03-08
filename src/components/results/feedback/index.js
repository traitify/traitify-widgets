import {feedbackModalShowState} from "lib/recoil";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useTranslate from "lib/hooks/use-translate";
import {useRecoilState} from "recoil";
import style from "./style.scss";
import Modal from "./modal";
import {userCompletedFeedbackQuery} from "../../../lib/recoil/feedback";

export default function Feedback() {
  const [show, setShow] = useRecoilState(feedbackModalShowState);
  const userCompletedFeedback = useLoadedValue(userCompletedFeedbackQuery);
  const translate = useTranslate();

  if(userCompletedFeedback) { return null; }

  const openModal = () => {
    setShow(true);
  };

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
      { show && <Modal />}
    </div>
  );
}
