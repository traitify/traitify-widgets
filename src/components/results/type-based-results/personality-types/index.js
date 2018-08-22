import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityTypeBarChart from "../personality-type-bar-chart";
import PersonalityTypeSlider from "../personality-type-slider";

class PersonalityTypes extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypes.initialized", this);
  }
  render(){
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
