import PropTypes from "prop-types";
import {Component} from "react";
import style from "./style.scss";

export default class CompetencySelect extends Component {
  static propTypes = {
    competencies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    displayedCompetency: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    displayCompetency: PropTypes.func.isRequired,
    tabBadge: PropTypes.func.isRequired
  }
  displayCompetency = (e) => {
    this.props.displayCompetency(e.target.value);
  }
  render() {
    const {competencies, displayedCompetency, tabBadge} = this.props;

    return (
      <div className={style.competencySelect}>
        <select
          className={style.mobileSelect}
          onChange={this.displayCompetency}
          value={displayedCompetency.id}
        >
          {competencies.map((competency) => (
            <option key={competency.id} value={competency.id}>{competency.name}</option>
          ))}
        </select>
        <p className={style.mobileBadge}>
          <img src={tabBadge(displayedCompetency.id)} alt={`${displayedCompetency.name} badge`} />
        </p>
      </div>
    );
  }
}
