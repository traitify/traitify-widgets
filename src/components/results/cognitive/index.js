import DangerousHTML from "components/common/dangerous-html";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Cognitive() {
  const disabled = useDisabledComponent("Results.Cognitive");
  const translate = useTranslate();

  if(disabled) { return null; }

  return (
    <section className={style.container}>
      <img alt="Brain" src="https://cdn.traitify.com/images/cognitive/brain.png" />
      <div className={style.heading}>{translate("results.thanks.heading")}</div>
      <DangerousHTML html={translate("results.thanks.learn_more")} />
    </section>
  );
}
