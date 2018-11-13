import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class PersonalityTypeBar extends Component{
  static propTypes = {
    barHeight: PropTypes.number.isRequired,
    traitify: TraitifyPropType.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.object.isRequired,
      score: PropTypes.number.isRequired
    }).isRequired
  }
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
  onKey = (e)=>{
    if(e.key === "Enter"){ this.setActive(); }
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
    const {activeType} = this.state;
    if(activeType){
      active = type.id === activeType.personality_type.id;
    }

    return (
      <li className={`${style.bar} ${active ? style.selected : ""}`}>
        <button
          className={style.score}
          onMouseOver={this.setActive}
          onClick={this.setActive}
          onFocus={this.setActive}
          style={{background: color, height: `${barHeight}%`}}
          type="button"
        >
          <span>{score}%</span>
        </button>
        <button
          className={style.label}
          style={active ? {backgroundColor: rgba(color, 8.5)} : {}}
          onMouseOver={this.setActive}
          onClick={this.setActive}
          onFocus={this.setActive}
          type="button"
        >
          <img src={icon} alt={title} />
          <i>{title}</i>
        </button>
      </li>
    );
  }
}

export {PersonalityTypeBar as Component};
export default withTraitify(PersonalityTypeBar);
