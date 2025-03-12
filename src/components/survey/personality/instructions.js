import PropTypes from "prop-types";
import {useState} from "react";
import DangerousHTML from "components/common/dangerous-html";
import Markdown from "components/common/markdown";
import useSetting from "lib/hooks/use-setting";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Instructions({
  instructionsText = null,
  instructionsHTML = null,
  onNext
}) {
  // TODO: Remove test data
  const allowSkip = useSetting("skipAssessmentAccommodation", {fallback: false}) || true;
  const [showAccommodation, setShowAccommodation] = useState(false);
  const translate = useTranslate();
  const onRequest = () => {};

  // TODO: onRequest
  // - make request
  // - update assessment's cache
  // - bubble something up so survey moves the user on?
  //   - trigger listener
  //   - update survey.personality.index to listen? maybe something else
  // - mimic in cognitive
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
          <button className={style.btnNext} onClick={onRequest} type="button">
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
