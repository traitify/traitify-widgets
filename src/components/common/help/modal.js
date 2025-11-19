/* global SOURCE, VERSION */
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import Bowser from "bowser";
import PropTypes from "prop-types";
import {useState} from "react";
import {useRecoilValue} from "recoil";
import DangerousHTML from "components/common/dangerous-html";
import Input from "components/common/form/input";
import Icon from "components/common/icon";
import BaseModal from "components/common/modal";
import Divider from "components/common/modal/divider";
import except from "lib/common/object/except";
import useTranslate from "lib/hooks/use-translate";
import {activeState, baseState, errorsState, orderState} from "lib/recoil";
import style from "./style.scss";

function Modal({show, setShow}) {
  const translate = useTranslate();
  const [message, setMessage] = useState("");
  const active = useRecoilValue(activeState);
  const base = useRecoilValue(baseState);
  const errors = useRecoilValue(errorsState);
  const order = useRecoilValue(orderState);

  if(!show) { return null; }

  const onChange = (event) => { setMessage(event.target.value); };
  const onClose = () => setShow(false);
  const onSubmit = (e) => {
    e.preventDefault();

    const params = {
      errors,
      message,
      state: {active, base, order: {}},
      widget: {source: SOURCE, version: VERSION}
    };

    if(!order) { params.state.order = except(order, ["assessments"]); }

    if(window.navigator && window.navigator.userAgent) {
      params.userAgent = window.navigator.userAgent;
      params.userAgentInfo = Bowser.parse(window.navigator.userAgent);
    }
    if(window.location) {
      const searchParams = window.location.search
        ? new URLSearchParams(window.location.search)
        : null;

      params.rootDirectory = `${window.location.protocol}//${window.location.host}`;
      params.url = String(window.location);
      params.urlInfo = {
        host: window.location.host,
        path: window.location.pathname,
        query: searchParams ? Object.fromEntries(searchParams.entries()) : {},
        scheme: window.location.protocol
      };
    }
    console.log("submit", params);
  };
  const heading = translate("help_modal.heading");
  const title = (
    <div className={style.title}>
      <Icon alt={heading} icon={faQuestionCircle} /> {heading}
    </div>
  );

  return (
    <BaseModal onClose={onClose} size="md" title={title}>
      <form className={style.content} onSubmit={onSubmit}>
        <DangerousHTML className="traitify--markdown" html={translate("help_modal.content_before_html")} />
        <Input
          className={style.input}
          onChange={onChange}
          placeholder={translate("help_modal.input_placeholder")}
          required={true}
          type="textarea"
          value={message}
        />
        <DangerousHTML className="traitify--markdown" html={translate("help_modal.content_after_html", {url: "https://www.traitify.com/ethical-assessments"})} />
        <Divider className={style.divider} />
        <div className={style.buttons}>
          <button className={style.cancel} onClick={onClose} type="button">{translate("cancel")}</button>
          <button className={style.submit} onClick={onSubmit} type="submit">{translate("help_modal.submit")}</button>
        </div>
      </form>
    </BaseModal>
  );
}

Modal.propTypes = {
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

export default Modal;
