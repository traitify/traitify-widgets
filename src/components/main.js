import { h, Component } from "preact";

import SlideDeck from "./slidedeck"

let components = {
	SlideDeck
}

export default class Main extends Component {
	constructor(){
		super();

		let com = this;
		let state = {};

		this.state = state;
		this.state.setState = function(newState){
			com.setState(newState)
		}
		return this;
	}

	componentWillMount(){
		let com = this;
		Object.keys(this.props).forEach((key)=>{
			com.state[key] = com.props[key];
		})
		this.setState(this.state)
	}

  render() {
		if(this.props.componentName){
			return React.createElement(components[this.props.componentName], this.props)
		}else{
			return (
				<div>
					<SlideDeck {...this.state}/>
				</div>
			)
		}
  }
}
