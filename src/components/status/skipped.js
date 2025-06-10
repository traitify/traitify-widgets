import DangerousHTML from "components/common/dangerous-html";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Skipped() {
  const translate = useTranslate();

  return (
    <section className={style.container}>
      <div className={style.header}>{translate("survey.accommodation.submitted")}</div>
      <DangerousHTML className={style.p} html={translate("survey.accommodation.submitted_text")} />
    </section>
  );
}
