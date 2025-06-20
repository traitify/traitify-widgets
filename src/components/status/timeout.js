import useListener from "lib/hooks/use-listener";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Timeout() {
  const listener = useListener();
  const translate = useTranslate();
  const retry = () => { listener.trigger("Order.polling", {status: "on"}); };

  return (
    <div className={style.container}>
      <div className={style.spacer} />
      <div className={[style.bold, style.p].join(" ")}>{translate("status.timeout")}</div>
      <button className={style.retry} onClick={retry} type="button">{translate("status.try_again")}</button>
    </div>
  );
}
