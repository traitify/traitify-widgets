import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Button({className = null, onClick}) {
  const translate = useTranslate();
  const buttonClass = [style.trigger, className].filter(Boolean).join(" ");

  return (
    <button className={buttonClass} type="button" onClick={onClick}><Icon alt={translate("help")} icon={faQuestionCircle} /></button>
  );
}
Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default Button;
