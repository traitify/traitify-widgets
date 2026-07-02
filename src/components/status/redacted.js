import {useState} from "react";
import DangerousHTML from "components/common/dangerous-html";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Redacted() {
  const showHelp = useOption("showHelp");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const translate = useTranslate();

  return (
    <section className={style.container}>
      <div className={style.header}>
        {showHelp && <span className={style.helpSpacer} />}
        <div>{translate("status.redacted.heading")}</div>
        {showHelp && <HelpButton onClick={() => setShowHelpModal(true)} />}
      </div>
      <DangerousHTML className={style.p} html={translate("status.redacted.text")} />
      {showHelpModal && <HelpModal show={showHelpModal} setShow={setShowHelpModal} />}
    </section>
  );
}
