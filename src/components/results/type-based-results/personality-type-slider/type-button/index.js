import {Component} from "react";

export default class TypeButton extends Component{
  setActive = (e)=>{
    e.preventDefault();

    this.props.setActive(this.props.type);
  }
  render(){
    return (
      <button className={this.props.className} onClick={this.setActive} type="button">
        {this.props.children}
      </button>
    );
  }
}
