import Component from "components/traitify-component";
import Color from "lib/color-helpers";
import style from "./style";

export default class PersonalityTypeSlide extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTypeSlide.initialized", this);
    this.traitify.ui.on("Assessment.activeType", ()=>{
      this.setState({activeType: this.traitify.ui.data["Assessment.activeType"]});
    });

    const activeType = this.traitify.ui.data["Assessment.activeType"];
    if(activeType){ this.setState({activeType}); }
  }
  render(){
    const {activeType} = this.state;
    const type = this.props.type.personality_type;

    if(!activeType){ return; }
    if(type.id !== activeType.personality_type.id){ return; }

    const color = `#${type.badge.color_1}`;
    const position = "middle";
    let perspective = `${(this.getOption("perspective") || "firstPerson").replace("Person", "")}_person_description`;
    let description = type.details.find(detail=>detail.title === perspective);
    description = description && description.body;
    if(!description){
      perspective = `${perspective === "first_person_description" ? "third" : "first"}_person_description"`;
      description = type.details.find(detail=>detail.title === perspective);
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
      <li class={`${style.slide} ${style[position]}`} style={`background: ${Color.rgba(color, 8.5)};`}>
        <span class={style.title} style={`color: ${color}`}>{name}</span>
        {description}
      </li>
    );
  }
}
