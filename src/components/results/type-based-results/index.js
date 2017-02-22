import { h, Component } from "preact";

import PersonalityBlend from "./personality-blend";
import PersonalityTypes from "./personality-types";
import PersonalityTraits from "./personality-traits";
import PersonalityDetails from "./personality-details";

export default class TypeBasedResults extends Component {
  render() {
    return (
      <section>
        <PersonalityBlend {...this.props} />
        <PersonalityTypes {...this.props} />
        <PersonalityTraits {...this.props} />
        <PersonalityDetails {...this.props} />
      </section>
    );
  }
}
