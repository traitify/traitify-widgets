import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityDimensionColumn from "../personality-dimension-column";
import style from "./style";

class PersonalityDimensionColumns extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimensionColumns.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimensionColumns.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const types = this.props.assessment.personality_types.sort((x, y) => {
      const xDetail = x.personality_type.details.find(({title}) => title === "Position") || {};
      const yDetail = y.personality_type.details.find(({title}) => title === "Position") || {};

      return (xDetail.body || 1) - (yDetail.body || 1);
    });

    return (
      <div className={style.container}>
        <p>{this.props.translate("candidate_description_for_dimensions")}</p>
        <ul className={style.columns}>
          {types.map((type) => (
            <PersonalityDimensionColumn
              key={type.personality_type.id}
              type={type}
              {...this.props}
            />
          ))}
        </ul>
        <div className={style.columnsBuffer} />
      </div>
    );
  }
}

export {PersonalityDimensionColumns as Component};
export default withTraitify(PersonalityDimensionColumns);
