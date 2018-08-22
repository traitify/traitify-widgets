import {Component} from "preact";

export default class TypeButton extends Component{
  setActive = (e)=>{
    e.preventDefault();

    this.props.setActive(this.props.type);
  }
  render(){
    return (
      <a className={this.props.style} href="#" onClick={this.setActive}>
        {this.props.children}
      </a>
    );
  }
}
