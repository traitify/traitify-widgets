import { h, Component } from "preact";

import PersonalityBlend from "./personality-blend";
import PersonalityType from "./personality-type";
import PersonalityTypes from "./personality-types";
import PersonalityTraits from "./personality-traits";
import PersonalityDetails from "./personality-details";

export default class TypeBasedResults extends Component {
  render() {
    if (!this.props.resultsReady()) return <div />;

    return (
      <section>
        {this.props.assessment.personality_blend ? (
          <PersonalityBlend {...this.props} />
        ) : (
          <PersonalityType {...this.props} />
        )}
        <PersonalityTypes {...this.props} />
        <PersonalityTraits {...this.props} />
        <PersonalityDetails {...this.props} />
      </section>
    );
  }
}
