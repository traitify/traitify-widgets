import PropTypes from "prop-types";
import isObject from "lib/common/object/is-object";
import FancyDropdown from "./fancy";
import SimpleDropdown from "./simple";

function Dropdown({
  currentText = null,
  options: _options,
  searchText = null,
  ...props
}) {
  const options = _options
    .map((option) => (isObject(option) ? option : {name: option, value: option}));

  if(!currentText || !searchText) {
    return <SimpleDropdown options={options} {...props} />;
  }

  return (
    <FancyDropdown
      currentText={currentText}
      options={options}
      searchText={searchText}
      {...props}
    />
  );
}

Dropdown.propTypes = {
  currentText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      }).isRequired
    ]).isRequired
  ).isRequired,
  searchText: PropTypes.string
};

export default Dropdown;
