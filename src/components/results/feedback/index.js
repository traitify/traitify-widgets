import {useSetRecoilState} from "recoil";
import {feedbackModalShowState} from "lib/recoil";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";
import Modal from "./modal";

export default function Feedback() {
  const setShow = useSetRecoilState(feedbackModalShowState);
  const translate = useTranslate(); // TODO i18n

  const openModal = () => {
    setShow(true);
  };

  return (
    <div>
      <div className={style.container}>
        <div className={style.details}>
          <span>Did you feel like your personality results match you?</span>
          <div className={style.buttons}>
            <button type="button" className={style.me} onClick={openModal}>Yes</button>
            <button type="button" className={style.notMe} onClick={openModal}>No</button>
          </div>
        </div>
      </div>
      <Modal />
    </div>
  );
}
