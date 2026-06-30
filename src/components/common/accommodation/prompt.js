import PropTypes from "prop-types";
import useSkipAssessment from "lib/hooks/use-skip-assessment";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Prompt({onBack}) {
  const {trigger: onSkip} = useSkipAssessment();
  const translate = useTranslate();

  return (
    <>
      <div className={style.text}>{translate("survey.accommodation.request_text")}</div>
      <div className={style.btnGroup}>
        <button className={style.btnBack} onClick={onBack} type="button">
          {translate("back")}
        </button>
        <button className={style.btnTheme} onClick={onSkip} type="button">
          {translate("survey.accommodation.confirm")}
        </button>
      </div>
    </>
  );
}

Prompt.propTypes = {onBack: PropTypes.func.isRequired};

export default Prompt;
