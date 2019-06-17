import PropTypes from "prop-types";
import {Component} from "react";

class QuestionSequences extends Component {
  static defaultProps = {questionSequences: null}
  static propTypes = {
    questionSequences: PropTypes.arrayOf(PropTypes.object)
  }
  render() {
    console.log(this.props.questionSequences);
    return (
      <div className="question-sequences-container">
        {this.props.questionSequences.map((sequence) => (
          <div className="sequence" key={sequence.id}>
            <div className="name">{sequence.name}</div>
            <div className="questions">
              {sequence.questions.map((question) => (
                <div className="question" key={question.id}>
                  {question.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default QuestionSequences;
