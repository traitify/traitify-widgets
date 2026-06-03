import {useEffect, useState} from "react";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import Markdown from "components/common/markdown";
import useActive from "lib/hooks/use-active";
import useComponentEvents from "lib/hooks/use-component-events";
import useOption from "lib/hooks/use-option";
import useOrder from "lib/hooks/use-order";
import Assessment from "./assessment";
import Error from "./error";
import Loading from "./loading";
import Skipped from "./skipped";
import style from "./style.scss";
import Timeout from "./timeout";
import useStatusTranslate from "./use-status-translate";

export default function Status() {
  const active = useActive();
  const [loading, setLoading] = useState(false);
  const order = useOrder();
  const showHelp = useOption("showHelp");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const translate = useStatusTranslate();
  const assessments = order?.assessments || [];

  useComponentEvents("Status", {order});
  useEffect(() => {
    const load = (active?.surveyType === "external" && !active.completed)
      || order?.status === "error";
    setLoading(load);
    if(!load) { return; }

    const timeout = setTimeout(() => { setLoading(false); }, 5500);
    return () => { clearTimeout(timeout); };
  }, [active?.id, active?.completed, order?.status]);

  if(!order) { return null; }
  if(order.status === "skipped") { return <Skipped />; }
  if(loading) { return <Loading />; }
  if(order.status === "error") { return <Error />; }
  if(active?.loading || order.status === "loading") { return <Loading />; }
  if(order.status === "timeout") { return <Timeout />; }
  if(assessments.length === 0) { return null; }

  return (
    <div className={style.container}>
      <div className={style.header}>
        {showHelp && <span className={style.helpSpacer} />}
        <div>{translate("heading")}</div>
        {showHelp && <HelpButton onClick={() => setShowHelpModal(true)} />}
      </div>
      <Markdown>{translate("text")}</Markdown>
      {assessments.map((assessment) => <Assessment key={assessment.id} assessment={assessment} />)}
      {showHelpModal && <HelpModal show={showHelpModal} setShow={setShowHelpModal} />}
    </div>
  );
}
