import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class Dimension extends Component{
  constructor(props){
    super(props);

    this.state = {showContent: props.index === 0};
  }
  trigger = (e)=>{
    e.preventDefault();

    this.props.traitify.ui.trigger("Dimension.showContent", this, this.props.type.personality_type);
    this.setState({showContent: !this.state.showContent});
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("Dimension.initialized", this);
  }
  description(suffix){
    const type = this.props.type.personality_type;
    const perspective = (this.props.getOption("perspective") || "firstPerson").replace("Person", "");
    let description = type.details.find(detail=>detail.title === `${perspective}_person_${suffix}`);
    description = description && description.body;

    if(description){ return description; }
    description = type.details.find(detail=>detail.title === `${perspective}_person_${suffix}`);

    return (description && description.body) || type.description;
  }
  render(){
    const type = this.props.type.personality_type;
    const color = `#${type.badge.color_1}`;
    let benefits = [];
    let pitfalls = [];

    type.details.forEach((detail)=>{
      if(detail.title === "Benefits"){ benefits.push(detail.body); }
      if(detail.title === "Pitfalls"){ pitfalls.push(detail.body); }
    });

    return (
      <li class={style.dimension}>
        <div class={style.main} style={`background: ${rgba(color, 8.5)};border-left: 5px solid ${color};`}>
          <div class={style.side}>
            <p class={style.icon}>
              <img src={type.badge.image_medium} alt="" role="presentation" ariahidden="true" />
            </p>
          </div>
          <div class={style.content}>
            <h2 class={style.title}>{type.name} <span style={`color: ${color}`}>|</span> {this.props.type.score} - {type.level}</h2>
            <p class={style.description}>{this.description("short_description")}</p>
            <p class={style.triggerButton}><a class={style.trigger} style={`background: ${rgba(color, 30)}`} onClick={this.trigger} href="#">{this.props.translate(this.state.showContent ? "show_less" : "show_more")}</a></p>
          </div>
        </div>
        {this.state.showContent &&
          <div class={style.details}>
            <div class={style.content} style={`background: ${rgba(color, 30)}`}>
              <div class={style.extendedDesc}>
                <h3>{this.props.translate("extended_description")}</h3>
                <p class={style.description}>{this.description("description")}</p>
              </div>
              <div class={style.detail}>
                <h4 class={style.benefits}>{this.props.translate("potential_benefits")}</h4>
                <ul>
                  {benefits.map((benefit)=>(<li>{benefit}</li>))}
                </ul>
              </div>
              <div class={style.detail}>
                <h4 class={style.pitfalls}>{this.props.translate("potential_pitfalls")}</h4>
                <ul>
                  {pitfalls.map((pitfall)=>(<li>{pitfall}</li>))}
                </ul>
              </div>
            </div>
          </div>
        }
      </li>
    );
  }
}

export {Dimension as Component};
export default withTraitify(Dimension);
