import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class Dimension extends Component{
  static propTypes = {
    getOption: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    traitify: TraitifyPropType.isRequired,
    translate: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.object.isRequired,
      score: PropTypes.number.isRequired
    }).isRequired
  }
  constructor(props){
    super(props);

    this.state = {showContent: props.index === 0};
  }
  trigger = (e)=>{
    e.preventDefault();

    this.props.traitify.ui.trigger("Dimension.showContent", this, this.props.type.personality_type);
    this.setState((state)=>({showContent: !state.showContent}));
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("Dimension.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("Dimension.updated", this);
  }
  description(suffix){
    const type = this.props.type.personality_type;
    const perspective = (this.props.getOption("perspective") || "firstPerson").replace("Person", "");
    let description = type.details.find((detail)=>(detail.title === `${perspective}_person_${suffix}`));
    description = description && description.body;

    if(description){ return description; }
    description = type.details.find((detail)=>(detail.title === `${perspective}_person_${suffix}`));

    return (description && description.body) || type.description;
  }
  render(){
    const type = this.props.type.personality_type;
    const color = `#${type.badge.color_1}`;
    const benefits = [];
    const pitfalls = [];

    type.details.forEach((detail)=>{
      if(detail.title === "Benefits"){ benefits.push(detail.body); }
      if(detail.title === "Pitfalls"){ pitfalls.push(detail.body); }
    });

    return (
      <li className={style.dimension}>
        <div className={style.main} style={{background: rgba(color, 8.5), borderLeft: `5px solid ${color}`}}>
          <div className={style.side}>
            <p className={style.icon}>
              <img src={type.badge.image_medium} alt="" ariahidden="true" />
            </p>
          </div>
          <div className={style.content}>
            <h2 className={style.title}>
              {type.name} <span style={{color}}>|</span> {this.props.type.score} - {type.level}
            </h2>
            <p className={style.description}>{this.description("short_description")}</p>
            <p className={style.triggerButton}>
              <button
                className={style.trigger}
                style={{background: rgba(color, 30)}}
                onClick={this.trigger}
                type="button"
              >
                {this.props.translate(this.state.showContent ? "show_less" : "show_more")}
              </button>
            </p>
          </div>
        </div>
        {this.state.showContent && (
          <div className={style.details}>
            <div className={style.content} style={{background: rgba(color, 30)}}>
              <div className={style.extendedDesc}>
                <h3>{this.props.translate("extended_description")}</h3>
                <p className={style.description}>{this.description("description")}</p>
              </div>
              <div className={style.detail}>
                <h4 className={style.benefits}>{this.props.translate("potential_benefits")}</h4>
                <ul>
                  {benefits.map((benefit)=>(<li key={benefit}>{benefit}</li>))}
                </ul>
              </div>
              <div className={style.detail}>
                <h4 className={style.pitfalls}>{this.props.translate("potential_pitfalls")}</h4>
                <ul>
                  {pitfalls.map((pitfall)=>(<li key={pitfall}>{pitfall}</li>))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </li>
    );
  }
}

export {Dimension as Component};
export default withTraitify(Dimension);
