import PropTypes from "prop-types";
import {useState} from "react";
import AccommodationModal from "components/common/accommodation/modal";
import Markdown from "components/common/markdown";
import Modal from "components/common/modal";
import Divider from "components/common/modal/divider";
import useSkipAssessment from "lib/hooks/use-skip-assessment";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Instructions({assessment, onClose}) {
  const {allow: allowSkip, dismiss: dismissSkip} = useSkipAssessment();
  const [showAccommodation, setShowAccommodation] = useState(false);
  const translate = useTranslate();

  const onContinue = () => {
    dismissSkip();
    onClose();
  };

  if(showAccommodation) {
    return <AccommodationModal show={showAccommodation} setShow={setShowAccommodation} />;
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
