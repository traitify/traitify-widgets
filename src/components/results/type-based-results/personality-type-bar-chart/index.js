import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeBar from "../personality-type-bar";

export default class PersonalityTypeBarChart extends Component {
  componentWillMount() {
    if(!this.props.activeType) {
      this.props.setState({ activeType: this.props.assessment.personality_types[0] });
    }
  }
  render() {
    var props = this.props;

    return (
      <ul class={style.chart}>
        {this.props.assessment.personality_types.map(function(type) {
          return <PersonalityTypeBar {...props} type={type} />;
        })}
      </ul>
    );
  }
}
