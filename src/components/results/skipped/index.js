import DangerousHTML from "components/common/dangerous-html";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Skipped() {
  const translate = useTranslate();

  return (
    <section className={style.container}>
      <div className={style.heading}>{translate("survey.accommodation.submitted")}</div>
      <DangerousHTML html={translate("survey.accommodation.submitted_text")} />
    </section>
  );
}
