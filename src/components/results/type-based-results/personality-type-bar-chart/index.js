import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeBar from "../personality-type-bar";

export default class PersonalityTypeBarChart extends Component {
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypeBarChart", "initialized", this);
  }
  componentWillMount() {
    this.activate();
  }
  componentWillUpdate() {
    this.activate();
  }
  activate() {
    if (this.props.resultsReady()){
      let type = this.props.assessment.personality_types[0];
      if (!this.props.activeType && type){
        this.props.setState({ activeType: type });
      }
    }
  }
  maxScore() {
    return this.props.assessment.personality_types[0].score;
  }
  barHeight(type) {
    let score = (100 - (this.maxScore() - type.score)) - 5;
    return score > 0 ? score : 0;
  }
  render() {
    if (!this.props.resultsReady()) return <div />;

    let props = this.props;

    return (
      <ul class={style.chart}>
        {this.props.assessment.personality_types.map((type)=>{
          return <PersonalityTypeBar {...props} type={type} barHeight={this.barHeight(type)} />;
        })}
      </ul>
    );
  }
}
