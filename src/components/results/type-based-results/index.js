import {Component} from "react";
import PersonalityBase from "./personality-base";
import PersonalityDetails from "./personality-details";
import PersonalityTraits from "./personality-traits";
import PersonalityTypes from "./personality-types";

export default class TypeBasedResults extends Component {
  render() {
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
