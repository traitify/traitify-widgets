import PropTypes from "prop-types";
import {Component} from "react";

// Maybe this should be functional
class Competencies extends Component {
  static defaultProps = {competencies: null}
  static propTypes = {
    competencies: PropTypes.arrayOf(PropTypes.object)
  }
  render() {
    return (
      <div className="competency-container">
        {this.props.competencies.map((competency) => (
          <div className="competency" key={competency.id}>
            <div className="name">
              {competency.name}
            </div>
            <div className="name">
              {competency.introduction}
            </div>
            <div className="name">
              {competency.name}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Competencies;
