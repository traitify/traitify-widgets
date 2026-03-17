import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import Divider from "./divider";
import style from "./style.scss";

function Modal({children, className = null, onClose, size = "xl", title}) {
  const sectionClass = [style.modalContainer, className].filter(Boolean).join(" ");
  const translate = useTranslate();

  return (
    <div className={`${style.modal} ${style.container} ${style[size]}`}>
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
          <Divider />
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
  onClose: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
};

export default Modal;
