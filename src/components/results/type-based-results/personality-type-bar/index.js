import {Component} from "react";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class PersonalityTypeBar extends Component{
  constructor(props){
    super(props);

    this.state = {activeType: null};
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypeBar.initialized", this);
    this.props.traitify.ui.on("Assessment.activeType", this.getActiveType);

    const activeType = this.props.traitify.ui.current["Assessment.activeType"];
    if(activeType){ this.setState({activeType}); }
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTypeBar.updated", this);
  }
  componentWillUnmount(){
    this.props.traitify.ui.off("Assessment.activeType", this.getActiveType);
  }
  getActiveType = ()=>{
    this.setState({activeType: this.props.traitify.ui.current["Assessment.activeType"]});
  }
  setActive = ()=>{
    this.props.traitify.ui.trigger("PersonalityTypeBar.changeType", this, this.props.type);
    this.props.traitify.ui.trigger("Assessment.activeType", this, this.props.type);
  }
  render(){
    const type = this.props.type.personality_type;
    const title = type.name;
    const icon = type.badge.image_medium;
    const color = `#${type.badge.color_1}`;
    const score = Math.round(this.props.type.score);
    const barHeight = Math.round(this.props.barHeight);

    let active = false;
    const activeType = this.state.activeType;
    if(activeType){
      active = type.id === activeType.personality_type.id;
    }

    return (
      <li className={`${style.bar} ${active ? style.selected : ""}`} onMouseOver={this.setActive} onClick={this.setActive}>
        <span className={style.score} style={{background: color, height: `${barHeight}%`}}>{score}%</span>
        <span className={style.label} style={active ? {backgroundColor: rgba(color, 8.5)} : {}}>
          <img src={icon} alt={title} />
          <i>{title}</i>
        </span>
      </li>
    );
  }
}

export {PersonalityTypeBar as Component};
export default withTraitify(PersonalityTypeBar);
