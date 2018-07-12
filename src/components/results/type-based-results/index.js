import Component from "components/traitify-component";
import PersonalityBase from "./personality-base";
import PersonalityTypes from "./personality-types";
import PersonalityTraits from "./personality-traits";
import PersonalityDetails from "./personality-details";

export default class TypeBasedResults extends Component{
  render(){
    const options = this.copyOptions();

    return (
      <section>
        <PersonalityBase options={options} />
        <PersonalityTypes options={options} />
        <PersonalityTraits options={options} />
        <PersonalityDetails options={options} />
      </section>
    );
  }
}
