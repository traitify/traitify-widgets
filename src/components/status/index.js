import {useEffect, useState} from "react";
import useActive from "lib/hooks/use-active";
import useComponentEvents from "lib/hooks/use-component-events";
import useOrder from "lib/hooks/use-order";
import useTranslate from "lib/hooks/use-translate";
import Assessment from "./assessment";
import Error from "./error";
import Loading from "./loading";
import Skipped from "./skipped";
import style from "./style.scss";
import Timeout from "./timeout";

export default function Status() {
  const active = useActive();
  const [activeLoading, setActiveLoading] = useState(false);
  const order = useOrder();
  const translate = useTranslate();
  const assessments = order?.assessments || [];

  useComponentEvents("Status", {order});
  useEffect(() => {
    if(active?.surveyType !== "external") { return; }
    if(active.completed) { return; }

    setActiveLoading(true);

    const timeout = setTimeout(() => { setActiveLoading(false); }, 5000);
    return () => { clearTimeout(timeout); };
  }, [active?.id, active?.completed]);

  if(!order) { return null; }
  if(order.status === "error") { return <Error />; }
  if(order.status === "skipped") { return <Skipped />; }
  if(activeLoading || active?.loading || order.status === "loading") { return <Loading />; }
  if(order.status === "timeout") { return <Timeout />; }
  if(assessments.length === 0) { return null; }

  return (
    <div className={style.container}>
      <div className={style.header}>{translate("status.heading")}</div>
      <div className={style.p}>{translate("status.text")}</div>
      {assessments.map((assessment) => <Assessment key={assessment.id} assessment={assessment} />)}
    </div>
  );
}
