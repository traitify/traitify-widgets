import {useEffect, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import useActive from "lib/hooks/use-active";
import useComponentEvents from "lib/hooks/use-component-events";
import useListener from "lib/hooks/use-listener";
import useOrder from "lib/hooks/use-order";
import {orderState} from "lib/recoil";
import Assessment from "./assessment";
import style from "./style.scss";

// TODO: Translate probably
const translations = {
  status: {
    error: "There was an error with your assessments",
    header: "Your Application Assessments",
    loading: "Loading your assessment",
    text: "As part of your application, we'd like to ask you to complete the following assessments. Please click on the button next to the assessment name. This will take you to where you'll complete the assessment and either be returned to this page if you have multiple assessments to complete or taken to the next stage of the process.",
    timeout: "Loading timed out",
    try_again: "Let's Try Again"
  }
};

export default function Status() {
  const active = useActive();
  const listener = useListener();
  const order = useOrder();
  const [activeLoading, setActiveLoading] = useState(false);
  const refreshOrder = useRecoilRefresher(orderState);
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
  if(order.status === "error") {
    const retry = () => { refreshOrder(); };

    return (
      <div className={style.container}>
        <div className={style.header}>{translations.status.header}</div>
        <div className={style.p}>{translations.status.error}</div>
        {assessments.map((assessment) => (
          <Assessment key={assessment.id} assessment={assessment} />
        ))}
        <button className={style.retry} onClick={retry} type="button">{translations.status.try_again}</button>
      </div>
    );
  }

  if(activeLoading || active?.loading || order.status === "loading") {
    return (
      <div className={style.container}>
        <img alt="" src="https://cdn.traitify.com/widgets/status/loading-sonar.gif" />
        <div className={[style.bold, style.p].join(" ")}>{translations.status.loading}</div>
      </div>
    );
  }

  if(order.status === "timeout") {
    const retry = () => { listener.trigger("Order.polling", {status: "on"}); };

    return (
      <div className={style.container}>
        <div className={style.spacer} />
        <div className={[style.bold, style.p].join(" ")}>{translations.status.timeout}</div>
        <button className={style.retry} onClick={retry} type="button">{translations.status.try_again}</button>
      </div>
    );
  }

  if(assessments.length === 0) { return null; }

  return (
    <div className={style.container}>
      <div className={style.header}>{translations.status.header}</div>
      <div className={style.p}>{translations.status.text}</div>
      {assessments.map((assessment) => <Assessment key={assessment.id} assessment={assessment} />)}
    </div>
  );
}
