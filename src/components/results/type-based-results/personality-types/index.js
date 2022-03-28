import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityTypeBarChart from "../personality-type-bar-chart";
import PersonalityTypeSlider from "../personality-type-slider";

class PersonalityTypes extends Component {
  static propTypes = {
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityTypes.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTypes.updated", this);
  }
  render() {
    return (
      <div>
        <PersonalityTypeBarChart {...this.props} />
        <PersonalityTypeSlider {...this.props} />
      </div>
    );
  }
}

export {PersonalityTypes as Component};
export default withTraitify(PersonalityTypes);
