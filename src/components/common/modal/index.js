import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import Divider from "./divider";
import style from "./style.scss";

export default function Modal({children, onClose, size = "xl", title}) {
  const translate = useTranslate();

  return (
    <div className={`${style.modal} ${style.container} ${style[size]}`}>
      <section className={style.modalContainer}>
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
  onClose: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
};
