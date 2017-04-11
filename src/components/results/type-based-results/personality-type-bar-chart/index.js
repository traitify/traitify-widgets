import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeBar from "../personality-type-bar";

export default class PersonalityTypeBarChart extends Component {
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypeBarChart", "initialized", this);
  }
  componentWillMount() {
    activate();
  }
  componentWillUpdate() {
    activate();
  }
  activate() {
    if (this.props.resultsReady()){
      let type = this.props.assessment.personality_types[0];
      if (!this.props.activeType && type){
        this.props.setState({ activeType: type });
      }
    }
  }
  render() {
    if (!this.props.resultsReady()) return <div />;

    let props = this.props;

    return (
      <ul class={style.chart}>
        {this.props.assessment.personality_types.map((type)=>{
          return <PersonalityTypeBar {...props} type={type} />;
        })}
      </ul>
    );
  }
}
