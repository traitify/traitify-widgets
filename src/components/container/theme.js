import PropTypes from "prop-types";
import useOption from "lib/hooks/use-option";

function Theme({children, className: _className = null}) {
  const colorScheme = useOption("colorScheme") || "light";
  const className = [
    "traitify--container",
    `traitify--color-scheme-${colorScheme}`,
    _className
  ].filter(Boolean).join(" ");

  return <div className={className}>{children}</div>;
}

Theme.propTypes = {children: PropTypes.node.isRequired, className: PropTypes.string};

export default Theme;
