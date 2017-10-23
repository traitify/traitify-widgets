import {h, Component} from "preact";
import style from "./style";

export default class Extras extends Component{
  componentDidMount(){
    this.props.triggerCallback("Extras", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let props = this.props;
    return (
			<div class={style.extras}>
				<div class={style.extra}>
					<div class={style.content}>
						<div class={style.bar} style={`background: #008dc7;`}></div>
						<h4 class={style.title} style={`color: #008dc7;`}>Complements</h4>
						<p class={style.description}>Sit harum culpa repellendus natus placeat cumque Non dignissimos fugiat sit quos pariatur. Rem distinctio laudantium illo fugiat maxime, animi. Laudantium quasi ex iure recusandae animi. Perferendis nemo dolores ipsam. Dolor optio accusantium quis modi pariatur! Accusantium ad cum repellat sit corrupti in consequuntur Consequatur quia vitae deserunt quos esse. Tempore consequatur id veniam eaque dolor odit Nemo dolores aperiam?</p>
					</div>
				</div>
				<div class={style.extra}>
					<div class={style.content}>
						<div class={style.bar} style={`background: #d04e4a;`}></div>
						<h4 class={style.title} style={`color: #d04e4a;`}>Conflicts</h4>
						<p class={style.description}>Sit harum culpa repellendus natus placeat cumque Non dignissimos fugiat sit quos pariatur. Rem distinctio laudantium illo fugiat maxime, animi. Laudantium quasi ex iure recusandae animi. Perferendis nemo dolores ipsam. Dolor optio accusantium quis modi pariatur! Accusantium ad cum repellat sit corrupti in consequuntur Consequatur quia vitae deserunt quos esse. Tempore consequatur id veniam eaque dolor odit Nemo dolores aperiam?</p>
					</div>
				</div>
				<div class={style.extra}>
					<div class={style.content}>
						<div class={style.bar} style={`background: #32be4b;`}></div>
						<h4 class={style.title} style={`color: #32be4b;`}>Best Work Environments</h4>
						<ul class={style.description}>
							<li>Is fast paced</li>
							<li>Values creativity</li>
							<li>Is fast paced</li>
							<li>Values creativity</li>
							<li>Is fast paced</li>
							<li>Values creativity</li>
							<li>Values creativity</li>
							<li>Is fast paced</li>
							<li>Values creativity</li>
						</ul>
					</div>
				</div>
			</div>
    );
  }
}
