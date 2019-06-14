import PropTypes from "prop-types";
import {Component} from "react";

// Maybe this should be functional
class Competency extends Component {
  static defaultProps = {competency: null}
  static propTypes = {
    competency: PropTypes.arrayOf(PropTypes.object)
  }
  render() {
    return (
      <div className="competency-container">
        <div className="competency">
          {this.props.competency.map((competency) => competency.name)}
        </div>
      </div>
    );
  }
}

export default Competency;
