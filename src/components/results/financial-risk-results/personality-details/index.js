import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective, detailsWithPerspective} from "lib/helpers";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityDetails extends Component {
  static defaultProps = {assessment: null};
  static propTypes = {
    assessment: PropTypes.shape({
      archetype: PropTypes.shape({
        details: PropTypes.arrayOf(
          PropTypes.shape({
            body: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired
          }).isRequired
        ).isRequired
      })
    }),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDetails.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }
    const options = {base: personality, perspective: this.props.getOption("perspective")};

    return (
      <div className={style.details}>
        <div className={style.detailsLife}>
          <h2>This style in everyday life:</h2>
          <p>{detailWithPerspective({...options, name: "Everyday Life Title"})}</p>
          <ul>
            {detailsWithPerspective({...options, name: "Everyday Life Detail"}).map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className={style.detailsFinancial}>
          <h2>This style in financial decisions:</h2>
          <p>{detailWithPerspective({...options, name: "Financial Decisions Title"})}</p>
          <ul>
            {detailsWithPerspective({...options, name: "Financial Decisions Detail"}).map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export {PersonalityDetails as Component};
export default withTraitify(PersonalityDetails);
