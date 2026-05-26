import style from "./style.scss";
import useStatusTranslate from "./use-status-translate";

export default function Loading() {
  const translate = useStatusTranslate();

  return (
    <div className={style.container}>
      <img alt="" src="https://cdn.traitify.com/widgets/status/loading-sonar.gif" />
      <div className={[style.bold, style.p].join(" ")}>{translate("loading")}</div>
    </div>
  );
}
