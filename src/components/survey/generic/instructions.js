import PropTypes from "prop-types";
import {useState} from "react";
import Markdown from "components/common/markdown";
import Modal from "components/common/modal";
import Divider from "components/common/modal/divider";
import useSkipAssessment from "lib/hooks/use-skip-assessment";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Instructions({assessment, onClose}) {
  const {allow: allowSkip, dismiss: dismissSkip, trigger: onSkip} = useSkipAssessment();
  const [showAccommodation, setShowAccommodation] = useState(false);
  const translate = useTranslate();

  const onContinue = () => {
    dismissSkip();
    onClose();
  };

  if(showAccommodation) {
    return (
      <Modal onClose={onClose} size="md" title={translate("survey.accommodation.request")}>
        <div className={style.markdown}>
          <p>{translate("survey.accommodation.request_text")}</p>
        </div>
        <Divider />
        <div className={style.btnGroup}>
          <button className={style.btnBack} onClick={() => setShowAccommodation(false)} type="button">
            {translate("back")}
          </button>
          <button className={style.btnTheme} onClick={onSkip} type="button">
            {translate("survey.accommodation.confirm")}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} size="md" title={translate("instructions")}>
      <Markdown>{assessment.survey.instructions}</Markdown>
      <Divider />
      <div className={style.btnGroup}>
        {allowSkip ? (
          <button className={style.btnBack} onClick={() => setShowAccommodation(true)} type="button">
            {translate("survey.accommodation.request")}
          </button>
        ) : <div />}
        <button
          className={style.btnTheme}
          onClick={onContinue}
          type="button"
        >
          {assessment.survey.instructionButton}
        </button>
      </div>
    </Modal>
  );
}

Instructions.propTypes = {
  assessment: PropTypes.shape({
    survey: PropTypes.shape({
      instructions: PropTypes.string.isRequired,
      instructionButton: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default Instructions;
