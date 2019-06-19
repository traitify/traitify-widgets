import PropTypes from "prop-types";
import {Component} from "react";
import QuestionSequences from "../question-sequences/index";

class Competencies extends Component {
  static defaultProps = {competencies: null}
  static propTypes = {
    competencies: PropTypes.arrayOf(PropTypes.object)
  }
  constructor(props) {
    super(props);

    this.state = {
      competencies: props.competencies,
      displayedCompetency: props.competencies[0]
    };
  }
  displayedCompetency(competency) {
    this.state.competencies.forEach((comp) => {
      if(competency.target.innerText === comp.id) {
        this.setState({displayedCompetency: comp});
      }
    });
  }
  render() {
    const {name, id, introduction, questionSequences} = this.state.displayedCompetency;
    return (
      <div className="competency-container">
        {this.state.competencies.map((competency) => (
          <div id="badge-container" key={competency.id}>
            <div role="link" tabIndex={0} onKeyPress={this.displayedCompetency.bind(this)} onClick={this.displayedCompetency.bind(this)}>{competency.id}</div>
          </div>
        ))}
        <div className="competency" key={id}>
          <div className="name">{name}</div>
          <div className="introduction">{introduction}</div>
          <div className="question-sequences">
            <QuestionSequences questionSequences={questionSequences} />
          </div>
          <br />
        </div>
      </div>
    );
  }
}

export default Competencies;
