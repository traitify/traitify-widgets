import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Modal({children, containerClass = null, onClose, title}) {
  const translate = useTranslate();
  const sectionClass = [style.modalContainer, containerClass].filter(Boolean).join(" ");
  return (
    <div className={`${style.modal} ${style.container}`}>
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
          <hr className={style.grayDivider} />
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
  containerClass: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};
