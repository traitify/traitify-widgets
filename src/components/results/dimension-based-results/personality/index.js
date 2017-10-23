import {h, Component} from "preact";
import style from "./style";

export default class Personality extends Component{
  componentDidMount(){
    this.props.triggerCallback("Personality", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let props = this.props;
    return (
			<div class={style.personality}>
				<div class={style.content}>
					Your Big 5 Personality is <strong>Confident</strong>
				</div>
			</div>
    );
  }
}
