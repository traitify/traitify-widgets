import useListener from "lib/hooks/use-listener";
import style from "./style.scss";
import useStatusTranslate from "./use-status-translate";

export default function Timeout() {
  const listener = useListener();
  const translate = useStatusTranslate();
  const retry = () => { listener.trigger("Order.polling", {status: "on"}); };

  return (
    <div className={style.container}>
      <div className={style.spacer} />
      <div className={[style.bold, style.p].join(" ")}>{translate("timeout")}</div>
      <button className={style.retry} onClick={retry} type="button">{translate("try_again")}</button>
    </div>
  );
}
