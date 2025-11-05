import PropTypes from "prop-types";
import style from "./style.scss";

function Input({className: _className = null, type = "text", ..._props}) {
  const className = [_className, style.input, style[type]].filter(Boolean).join(" ");
  const props = {..._props, className};

  switch(type) {
    case "textarea":
      return <textarea {...props} />;
    default:
      return <input {...props} type={type} />;
  }
}

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(["text", "textarea"])
};

export default Input;
