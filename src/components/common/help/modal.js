/* global SOURCE, VERSION */
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import Bowser from "bowser/es5";
import PropTypes from "prop-types";
import {useRef, useState} from "react";
import {useRecoilValue} from "recoil";
import DangerousHTML from "components/common/dangerous-html";
import Input from "components/common/form/input";
import Icon from "components/common/icon";
import BaseModal from "components/common/modal";
import Divider from "components/common/modal/divider";
import except from "lib/common/object/except";
import useHttp from "lib/hooks/use-http";
import useTranslate from "lib/hooks/use-translate";
import {activeState, baseState, errorsState, orderState} from "lib/recoil";
import style from "./style.scss";

function Modal({show, setShow}) {
  const http = useHttp();
  const translate = useTranslate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const active = useRecoilValue(activeState);
  const base = useRecoilValue(baseState);
  const errors = useRecoilValue(errorsState);
  const order = useRecoilValue(orderState);
  const submitting = useRef(false);

  if(!show) { return null; }

  const disabled = submitted || submitting.current;
  const onChange = (event) => { setMessage(event.target.value); };
  const onClose = () => setShow(false);
  const onSubmit = async(e) => {
    e.preventDefault();

    if(submitting.current) { return; }
    if(submitted) { return; }
    if(!message) {
      setError(translate("help_modal.message_required"));
      return;
    }

    submitting.current = true;

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

    const path = "/feedback/widget-help-request";
    const response = await http.post(path, params).catch((r) => ({errors: [r.message]}));
    if(response.success) {
      setError("");
      setSubmitted(true);
      submitting.current = false;
    } else {
      console.warn("help-feedback", response); // eslint-disable-line no-console
      setError(translate("help_modal.error_submitting"));
      submitting.current = false;
    }
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
        {error && <div className={style.error}>{error}</div>}
        {submitted && <div className={style.submitted}>{translate("help_modal.submitted")}</div>}
        {(error || submitted) && <Divider className={style.divider} />}
        <label htmlFor="traitify-help-message">
          {translate("help_modal.input_label")}
          <Input
            className={style.input}
            id="traitify-help-message"
            onChange={onChange}
            placeholder={translate("help_modal.input_placeholder")}
            required={true}
            type="textarea"
            value={message}
          />
        </label>
        <DangerousHTML className="traitify--markdown" html={translate("help_modal.content_html", {url: "https://www.traitify.com/ethical-assessments"})} />
        <Divider className={style.divider} />
        <div className={style.buttons}>
          <button className={style.cancel} onClick={onClose} type="button">{translate("cancel")}</button>
          <button className={[style.submit, disabled ? style.disabled : ""].join(" ")} disabled={disabled} onClick={onSubmit} type="submit">{translate("help_modal.submit")}</button>
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
