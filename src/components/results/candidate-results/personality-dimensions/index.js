import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityDimensionColumns from "../personality-dimension-columns";
import PersonalityDimensionDetails from "../personality-dimension-details";
import style from "./style";

class PersonalityDimensions extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
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

    return (
      <div className={style.container}>
        {!disableColumns && <PersonalityDimensionColumns {...this.props} />}
        {!disableDetails && (
          <PersonalityDimensionDetails {...this.props} />
        )}
      </div>
    );
  }
}

export {PersonalityDimensions as Component};
export default withTraitify(PersonalityDimensions);
