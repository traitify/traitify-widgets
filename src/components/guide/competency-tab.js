import PropTypes from "prop-types";
import {Component} from "react";
import style from "./style";

export default class CompetencyTab extends Component {
  static propTypes = {
    competency: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    displayedCompetency: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    displayCompetency: PropTypes.func.isRequired,
    tabBadge: PropTypes.func.isRequired
  }
  displayCompetency = () => {
    this.props.displayCompetency(this.props.competency.id);
  }
  render() {
    const {competency, displayedCompetency, tabBadge} = this.props;

    return (
      <li className={competency.id === displayedCompetency.id ? style.tabActive : null}>
        <button
          onKeyPress={this.displayCompetency}
          onClick={this.displayCompetency}
          name={competency.name}
          type="button"
        >
          <img src={tabBadge(competency.id)} alt={`${competency.name} badge`} />
          <br />
          {competency.name}
        </button>
      </li>
    );
  }
}
