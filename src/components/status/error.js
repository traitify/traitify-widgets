import {useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import useOption from "lib/hooks/use-option";
import {orderState} from "lib/recoil";
import style from "./style.scss";
import useStatusTranslate from "./use-status-translate";

export default function Error() {
  const refreshOrder = useRecoilRefresher(orderState);
  const showHelp = useOption("showHelp");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const translate = useStatusTranslate();
  const retry = () => { refreshOrder(); };

  return (
    <div className={style.container}>
      <div className={style.header}>
        {showHelp && <span className={style.helpSpacer} />}
        <div>{translate("heading")}</div>
        {showHelp && <HelpButton onClick={() => setShowHelpModal(true)} />}
      </div>
      <div className={style.p}>{translate("error")}</div>
      <button className={style.retry} onClick={retry} type="button">{translate("try_again")}</button>
      {showHelpModal && <HelpModal show={showHelpModal} setShow={setShowHelpModal} />}
    </div>
  );
}
