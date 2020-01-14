import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityDimensionColumns from "../personality-dimension-columns";
import PersonalityDimensionDetails from "../personality-dimension-details";
import style from "./style.scss";

class PersonalityDimensions extends Component {
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  static defaultProps = {assessment: null}
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimensions.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimensions.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const disabledComponents = this.props.getOption("disabledComponents") || [];
    const disableColumns = disabledComponents.includes("PersonalityDimensionColumns");
    const disableDetails = disabledComponents.includes("PersonalityDimensionDetails");
    if(disableColumns && disableDetails) { return null; }

    const types = this.props.assessment.personality_types.sort((x, y) => {
      const xDetail = x.personality_type.details.find(({title}) => title === "Position") || {};
      const yDetail = y.personality_type.details.find(({title}) => title === "Position") || {};

      return (xDetail.body || 1) - (yDetail.body || 1);
    });

    return (
      <div className={style.container}>
        {!disableColumns && <PersonalityDimensionColumns {...this.props} />}
        {!disableDetails && (
          <ul className={style.details}>
            {types.map((type) => (
              <PersonalityDimensionDetails
                key={type.personality_type.id}
                type={type}
                {...this.props}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export {PersonalityDimensions as Component};
export default withTraitify(PersonalityDimensions);
