import {Component} from "preact";
import PersonalityBase from "./personality-base";
import PersonalityTypes from "./personality-types";
import PersonalityTraits from "./personality-traits";
import PersonalityDetails from "./personality-details";

export default class TypeBasedResults extends Component{
  render(){
    return (
      <section>
        <PersonalityBase {...this.props} />
        <PersonalityTypes {...this.props} />
        <PersonalityTraits {...this.props} />
        <PersonalityDetails {...this.props} />
      </section>
    );
  }
}
