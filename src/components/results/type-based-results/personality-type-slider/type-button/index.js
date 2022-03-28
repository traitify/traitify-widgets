import PropTypes from "prop-types";
import {Component} from "react";

export default class TypeButton extends Component {
  static defaultProps = {children: null, className: null};
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    setActive: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired,
      score: PropTypes.number.isRequired
    }).isRequired
  };
  setActive = () => {
    this.props.setActive(this.props.type);
  };
  render() {
    return (
      <button className={this.props.className} onClick={this.setActive} type="button">
        {this.props.children}
      </button>
    );
  }
}
