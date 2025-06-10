import PropTypes from "prop-types";
import {useState} from "react";
import DangerousHTML from "components/common/dangerous-html";
import Markdown from "components/common/markdown";
import useSkipAssessment from "lib/hooks/use-skip-assessment";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Instructions({
  instructionsText = null,
  instructionsHTML = null,
  onNext
}) {
  const {allow: allowSkip, trigger: onSkip} = useSkipAssessment();
  const [showAccommodation, setShowAccommodation] = useState(false);
  const translate = useTranslate();

  if(showAccommodation) {
    return (
      <>
        <div className={style.markdown}>
          <h1>{translate("survey.accommodation.request")}</h1>
          <p>{translate("survey.accommodation.request_text")}</p>
        </div>
        <div className={style.btnGroup}>
          <button className={style.btnBack} onClick={() => setShowAccommodation(false)} type="button">
            {translate("back")}
          </button>
          <button className={style.btnNext} onClick={onSkip} type="button">
            {translate("survey.accommodation.confirm")}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {instructionsHTML ? (
        <DangerousHTML className={style.markdown} html={instructionsHTML} />
      ) : (
        <Markdown className={style.markdown}>{instructionsText}</Markdown>
      )}
      <div className={style.btnGroup}>
        {allowSkip && (
          <button className={style.btnBack} onClick={() => setShowAccommodation(true)} type="button">
            {translate("survey.accommodation.request")}
          </button>
        )}
        <button className={style.btnNext} onClick={onNext} type="button">
          {translate("get_started")}
        </button>
      </div>
    </>
  );
}

Instructions.propTypes = {
  instructionsText: PropTypes.string,
  instructionsHTML: PropTypes.string,
  onNext: PropTypes.func.isRequired
};

export default Instructions;
