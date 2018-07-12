import Component from "components/traitify-component";
import Radar from "./radar";
import PersonalityTypes from "./personality-types";
import PersonalityHeading from "./personality-heading";
import PersonalityDetails from "./personality-details";
import Dimensions from "./dimensions";
import PersonalityTraits from "./personality-traits";

export default class DimensionBasedResults extends Component{
  render(){
    const options = this.copyOptions();

    return (
      <section>
        <Radar options={options} />
        <PersonalityTypes options={options} />
        <PersonalityHeading options={options} />
        <PersonalityDetails options={options} />
        <Dimensions options={options} />
        <PersonalityTraits options={options} />
      </section>
    );
  }
}
