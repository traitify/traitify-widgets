import PropTypes from "prop-types";
import Markdown from "components/common/markdown";
import Modal from "components/common/modal";
import Divider from "components/common/modal/divider";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Instructions({assessment, onClose}) {
  const translate = useTranslate();

  return (
    <Modal onClose={onClose} size="md" title={translate("instructions")}>
      <Markdown>{assessment.survey.instructions}</Markdown>
      <Divider />
      <div className={style.btnGroup}>
        <div />
        <button
          className={style.btnTheme}
          onClick={onClose}
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
