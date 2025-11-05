import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Button({className = null, expand = false, onClick}) {
  const translate = useTranslate();
  const buttonClass = [style.trigger, className, expand && style.expand].filter(Boolean).join(" ");
  const text = translate("help_modal.trigger");

  return (
    <div className={buttonClass}>
      <button type="button" onClick={onClick}>
        {text} <Icon alt={text} icon={faQuestionCircle} />
      </button>
    </div>
  );
}
Button.propTypes = {
  className: PropTypes.string,
  expand: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default Button;
