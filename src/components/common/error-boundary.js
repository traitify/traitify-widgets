import PropTypes from "prop-types";
import {Component} from "react";

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onError: PropTypes.func.isRequired
  };
  static getDerivedStateFromError(error) {
    return {error: `${error.name}: ${error.message}`};
  }
  componentDidCatch(...options) {
    this.props.onError(...options);
  }
  render() {
    return this.props.children;
  }
}
