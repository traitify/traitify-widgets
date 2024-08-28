import PropTypes from "prop-types";
import style from "./style.scss";

function SimpleDropdown({className: _className = null, options, ...props}) {
  const className = [_className, style.container].filter(Boolean).join(" ");

  return (
    <label className={className} htmlFor={props.id}>
      <select {...props}>
        {options.map(({name, value}) => (
          <option key={value} value={value}>{name}</option>
        ))}
      </select>
    </label>
  );
}

SimpleDropdown.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default SimpleDropdown;
