import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeSlide from "../personality-type-slide";

export default class PersonalityTypeSlider extends Component {
  constructor() {
    super();
    this.setActive = this.setActive.bind(this);
  }
  setActive(type, e) {
    e.preventDefault()
    this.props.setState({ activeType: type });
  }
  render() {
    var props = this.props;
    if(props.activeType) {
      var id = props.activeType.personality_type.id;
      var ids = props.assessment.personality_types.map((type) => { return type.personality_type.id; });
      var index = ids.indexOf(id);
      var backType = props.assessment.personality_types[index - 1];
      var nextType = props.assessment.personality_types[index + 1];
    }

    return (
      <div class={style.slider}>
        {backType && (
          <a class={style.back} href="#" onClick={this.setActive.bind(null, backType)}>
            <img src="http://placehold.it/50/000000" alt="Back" />
          </a>
        )}
        <ul>
          {props.assessment.personality_types.map(function(type) {
            return <PersonalityTypeSlide {...props} type={type} />;
          })}
        </ul>
        {nextType && (
          <a class={style.next} href="#" onClick={this.setActive.bind(null, nextType)}>
            <img src="http://placehold.it/50/000000" alt="Next" />
          </a>
        )}
      </div>
    );
  }
}
