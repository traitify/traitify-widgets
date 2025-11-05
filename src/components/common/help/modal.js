import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import DangerousHTML from "components/common/dangerous-html";
import Input from "components/common/form/input";
import Icon from "components/common/icon";
import BaseModal from "components/common/modal";
import Divider from "components/common/modal/divider";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Modal({show, setShow}) {
  const translate = useTranslate();

  if(!show) { return null; }

  const onClose = () => setShow(false);
  const onSubmit = () => {
    console.log("submit");
  };
  const heading = translate("help_modal.heading");
  const title = (
    <div className={style.title}>
      <Icon alt={heading} icon={faQuestionCircle} /> {heading}
    </div>
  );

  return (
    <BaseModal onClose={onClose} size="md" title={title}>
      <div className={style.content}>
        <DangerousHTML className="traitify--markdown" html={translate("help_modal.content_before_html")} />
        <Input className={style.input} placeholder={translate("help_modal.input_placeholder")} type="textarea" />
        <DangerousHTML className="traitify--markdown" html={translate("help_modal.content_after_html", {url: "https://www.traitify.com/ethical-assessments"})} />
        <Divider className={style.divider} />
        <div className={style.buttons}>
          <button className={style.cancel} onClick={onClose} type="button">{translate("cancel")}</button>
          <button className={style.submit} onClick={onSubmit} type="button">{translate("help_modal.submit")}</button>
        </div>
      </div>
    </BaseModal>
  );
}

Modal.propTypes = {
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

export default Modal;
