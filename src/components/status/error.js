import {useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {orderState} from "lib/recoil";
import style from "./style.scss";

export default function Error() {
  const refreshOrder = useRecoilRefresher(orderState);
  const showHelp = useOption("showHelp");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const translate = useTranslate();
  const retry = () => { refreshOrder(); };

  return (
    <div className={style.container}>
      <div className={style.header}>
        {showHelp && <span className={style.helpSpacer} />}
        <div>{translate("status.heading")}</div>
        {showHelp && <HelpButton onClick={() => setShowHelpModal(true)} />}
      </div>
      <div className={style.p}>{translate("status.error")}</div>
      <button className={style.retry} onClick={retry} type="button">{translate("status.try_again")}</button>
      {showHelpModal && <HelpModal show={showHelpModal} setShow={setShowHelpModal} />}
    </div>
  );
}
