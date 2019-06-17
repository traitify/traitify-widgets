import PropTypes from "prop-types";
import {Component} from "react";
import QuestionSequences from "../question-sequences/index";
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
            <div className="name">{competency.name}</div>
            <div className="introduction">{competency.introduction}</div>
            <div className="question-sequences">
              <QuestionSequences questionSequences={competency.questionSequences} />
            </div>
            <br />
          </div>
        ))}
      </div>
    );
  }
}

export default Competencies;
