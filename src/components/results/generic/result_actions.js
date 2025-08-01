import {faPrint, faQuestionCircle, faEnvelopeOpen, faArrowUpFromBracket, faArrowRotateLeft} from "@fortawesome/free-solid-svg-icons";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function ResultActions() {
  const translate = useTranslate();
  return (
    <div className={style.assessmentResult}>
      <div className={style.title}>{translate("results.generic.assessment_results")}</div>
      <div className={style.actions}>
        <Icon className={style.icon} alt="Refresh" icon={faArrowRotateLeft} />
        <Icon className={style.icon} alt="Print" icon={faPrint} />
        <Icon className={style.icon} alt="Mail" icon={faEnvelopeOpen} />
        <Icon className={style.icon} alt="Share" icon={faArrowUpFromBracket} />
        <Icon className={style.icon} alt="Help" icon={faQuestionCircle} />
      </div>
    </div>
  );
}
