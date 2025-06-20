import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import useTranslate from "lib/hooks/use-translate";
import {orderState} from "lib/recoil";
import style from "./style.scss";

export default function Error() {
  const refreshOrder = useRecoilRefresher(orderState);
  const translate = useTranslate();
  const retry = () => { refreshOrder(); };

  return (
    <div className={style.container}>
      <div className={style.header}>{translate("status.heading")}</div>
      <div className={style.p}>{translate("status.error")}</div>
      <button className={style.retry} onClick={retry} type="button">{translate("status.try_again")}</button>
    </div>
  );
}
