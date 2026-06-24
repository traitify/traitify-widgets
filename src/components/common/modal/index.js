/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useRef} from "react";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import Divider from "./divider";
import style from "./style.scss";

function Modal({
  children,
  className = null,
  divider = true,
  onClose,
  size = "lg",
  title
}) {
  const onClick = (event) => event.target === event.currentTarget && onClose();
  const onKey = (event) => event.key === "Escape" && onClose();
  const sectionClass = [style.modalContainer, className].filter(Boolean).join(" ");
  const translate = useTranslate();
  const wrapper = useRef();

  useEffect(() => { wrapper.current?.focus(); }, []);

  return (
    <div
      className={`${style.modal} ${style.container} ${style[size]}`}
      onClick={onClick}
      onKeyDown={onKey}
      ref={wrapper}
      role="dialog"
      tabIndex={-1}
    >
      <section className={sectionClass}>
        <div className={style.modalContent}>
          <div className={style.header}>
            <div>{title}</div>
            <div>
              <Icon
                aria-label={translate("close")}
                className={style.close}
                icon={faTimes}
                onClick={onClose}
                tabIndex="-1"
              />
            </div>
          </div>
          {divider && <Divider />}
          <div className={style.content}>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  divider: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
};

export default Modal;
