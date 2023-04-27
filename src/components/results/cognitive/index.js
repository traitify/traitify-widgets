import DangerousHTML from "components/common/dangerous-html";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Cognitive() {
  const translate = useTranslate();

  return (
    <section className={style.container}>
      <img alt="Brain" src="https://cdn.traitify.com/images/cognitive/brain.png" />
      <div className={style.heading}>{translate("cognitive_results_heading")}</div>
      <DangerousHTML html={translate("cognitive_results_html")} />
    </section>
  );
}
