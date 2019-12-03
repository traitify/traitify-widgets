import PropTypes from "prop-types";
import {Component} from "react";

export default class TypeButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    setActive: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.object.isRequired,
      score: PropTypes.number.isRequired
    }).isRequired
  }
  static defaultProps = {children: null, className: null}
  setActive = () => {
    this.props.setActive(this.props.type);
  }
  render() {
    return (
      <button className={this.props.className} onClick={this.setActive} type="button">
        {this.props.children}
      </button>
    );
  }
}
