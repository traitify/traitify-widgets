import { h, Component } from "preact";
import Slide from "./_slide";

export default class slideDeck extends Component {
  constructor (){
    super();
    this.state = {};
    return this;
  }

  onComplete (){
    this.props.fetch()
  }

  render() {
    return (
      <div>
        {(this.props.assessment.slides || []).map((slide)=>{
          return (
            <Slide slide={slide} />
          )
        })}
      </div>
    )
  }
}
