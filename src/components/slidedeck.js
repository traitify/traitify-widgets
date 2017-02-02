import { h, Component } from "preact";

export default class slideDeck extends Component {
	constructor (){
		super();
		this.state = {};
		this.handleClick = this.handleClick.bind(this);
		return this;
	}

	handleClick (){
		this.props.goofy = "hi";
		this.props.setState(this.props)
	}

  render() {
		return (
			<div onClick={this.handleClick}>
				{this.props.goofy}
				howdy
			</div>
		)
  }
}
