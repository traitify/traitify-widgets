import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Loading() {
  const translate = useTranslate();

  return (
    <div className={style.container}>
      <img alt="" src="https://cdn.traitify.com/widgets/status/loading-sonar.gif" />
      <div className={[style.bold, style.p].join(" ")}>{translate("status.loading")}</div>
    </div>
  );
}
