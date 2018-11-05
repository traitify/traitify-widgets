import {Component} from "react";

export default class TypeButton extends Component{
  setActive = (e)=>{
    e.preventDefault();

    this.props.setActive(this.props.type);
  }
  render(){
    return (
      <a className={this.props.className} href="#" onClick={this.setActive}>
        {this.props.children}
      </a>
    );
  }
}
