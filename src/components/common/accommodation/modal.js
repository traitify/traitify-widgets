import PropTypes from "prop-types";
import BaseModal from "components/common/modal";
import useTranslate from "lib/hooks/use-translate";
import Prompt from "./prompt";

function Modal({show, setShow}) {
  const translate = useTranslate();

  if(!show) { return null; }

  const onClose = () => setShow(false);

  return (
    <BaseModal onClose={onClose} size="md" title={translate("survey.accommodation.request")}>
      <Prompt onBack={onClose} />
    </BaseModal>
  );
}

Modal.propTypes = {
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

export default Modal;
