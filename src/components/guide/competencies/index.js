import PropTypes from "prop-types";
import {Component} from "react";
import screenWidth from "./helpers";
import QuestionSequences from "../question-sequences/index";
// import style from "./style";

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
  selectBoxOrTabs() {
    if(screenWidth() > 500) {
      return (
        this.state.competencies.map((competency, index) => {
          console.log(index);
          return (
            <div id="badge-container" key={competency.id}>
              <div
                role="link"
                tabIndex={0}
                onKeyPress={(e) => this.displayedCompetency(e)}
                onClick={(e) => this.displayedCompetency(e)}
              >
                {competency.id}
              </div>
            </div>
          );
        })
      );
    } else {
      return (
        this.state.competencies.map((competency) => (
          <div id="badge-container" key={competency.id}>
            <select
              onKeyPress={(e) => this.displayedCompetency(e)}
              onClick={(e) => this.displayedCompetency(e)}
            >
              {competency.id}
            </select>
          </div>
        ))
      );
    }
  }
  render() {
    const {name, id, introduction, questionSequences} = this.state.displayedCompetency;
    return (
      <div className="competency-container">
        {this.selectBoxOrTabs()}
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
