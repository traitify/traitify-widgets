import Component from "components/traitify-component";
import PersonalityTypeBarChart from "../personality-type-bar-chart";
import PersonalityTypeSlider from "../personality-type-slider";

export default class PersonalityTypes extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTypes.initialized", this);
  }
  render(){
    const options = this.copyOptions();

    return (
      <div>
        <PersonalityTypeBarChart options={options} />
        <PersonalityTypeSlider options={options} />
      </div>
    );
  }
}
