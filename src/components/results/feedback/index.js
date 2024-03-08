import {useSetRecoilState} from "recoil";
import {feedbackModalShowState} from "lib/recoil";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";
import Modal from "./modal";

export default function Feedback() {
  const setShow = useSetRecoilState(feedbackModalShowState);
  const translate = useTranslate();

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
      <Modal />
    </div>
  );
}
