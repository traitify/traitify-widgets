import PropTypes from "prop-types";

export default PropTypes.shape({
  get: PropTypes.func.isRequired,
  put: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired
});
