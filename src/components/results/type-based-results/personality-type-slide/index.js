import {Component} from "react";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class PersonalityTypeSlide extends Component{
  constructor(props){
    super(props);

    this.state = {activeType: null};
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypeSlide.initialized", this);
    this.props.traitify.ui.on("Assessment.activeType", this.getActiveType);

    const activeType = this.props.traitify.ui.current["Assessment.activeType"];
    if(activeType){ this.setState({activeType}); }
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTypeSlide.updated", this);
  }
  componentWillUnmount(){
    this.props.traitify.ui.off("Assessment.activeType", this.getActiveType);
  }
  getActiveType = ()=>{
    this.setState({activeType: this.props.traitify.ui.current["Assessment.activeType"]});
  }
  render(){
    const {activeType} = this.state;
    const type = this.props.type.personality_type;

    if(!activeType){ return null; }
    if(type.id !== activeType.personality_type.id){ return null; }

    const color = `#${type.badge.color_1}`;
    const position = "middle";
    let perspective = `${(this.props.getOption("perspective") || "firstPerson").replace("Person", "")}_person_description`;
    let description = type.details.find((detail)=>(detail.title === perspective));
    description = description && description.body;
    if(!description){
      perspective = `${perspective === "first_person_description" ? "third" : "first"}_person_description"`;
      description = type.details.find((detail)=>(detail.title === perspective));
      description = (description && description.body) || type.description;
    }

    let name;
    if(description[0] === "'"){
      name = description.split("'")[1];
      description = description.split("'").splice(2).join("'");
    }else{
      name = type.name;
      description = `- ${description}`;
    }

    return (
      <li className={`${style.slide} ${style[position]}`} style={{background: rgba(color, 8.5)}}>
        <span className={style.title} style={{color}}>{name}</span>
        {description}
      </li>
    );
  }
}

export {PersonalityTypeSlide as Component};
export default withTraitify(PersonalityTypeSlide);
