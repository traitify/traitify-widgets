import {Component} from "react";
import Radar from "./radar";
import PersonalityTypes from "./personality-types";
import PersonalityHeading from "./personality-heading";
import PersonalityDetails from "./personality-details";
import Dimensions from "./dimensions";
import PersonalityTraits from "./personality-traits";

export default class DimensionBasedResults extends Component {
  render() {
    return (
      <section>
        <Radar {...this.props} />
        <PersonalityTypes {...this.props} />
        <PersonalityHeading {...this.props} />
        <PersonalityDetails {...this.props} />
        <Dimensions {...this.props} />
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}
