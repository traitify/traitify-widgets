import PropTypes from "prop-types";

const traitify = PropTypes.shape({
  get: PropTypes.func.isRequired,
  put: PropTypes.func.isRequired
});

const ui = PropTypes.shape({
  current: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  off: PropTypes.func.isRequired,
  on: PropTypes.func.isRequired,
  trigger: PropTypes.func.isRequired
});

export default {
  traitify,
  ui
};
