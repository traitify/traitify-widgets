import {h, Component} from "preact";
import style from "./style";

export default class PersonalityHeading extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityHeading", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    return (
      <div class={style.personality}>
        <div class={style.content}>
          Your Big 5 Personality is <strong>Confident</strong>
        </div>
      </div>
    );
  }
}
