import PropTypes from "prop-types";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Button({className = null, onClick}) {
  const translate = useTranslate();
  const buttonClass = [style.trigger, className].filter(Boolean).join(" ");

  return (
    <button className={buttonClass} onClick={onClick} type="button">
      {translate("survey.accommodation.request")}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default Button;
