import { h, Component } from "preact";

import PersonalityTypeBarChart from "../personality-type-bar-chart";

export default class PersonalityTypes extends Component {
  render() {
    return (
      <div>
        <PersonalityTypeBarChart {...this.props} />
      </div>
    );
  }
}
