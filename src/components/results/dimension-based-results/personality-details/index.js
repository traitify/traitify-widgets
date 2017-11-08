import {h, Component} from "preact";
import style from "./style";

export default class PersonalityDetails extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityDetails", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let personality = this.props.assessment.archetype;
    personality = personality || this.props.assessment.personality_types[0].personality_type;

    let details = personality.details;
    if(!details) return <div />;

    let complement = details.find(d=>d.title === "Complement");
    complement = complement && complement.body;
    let conflict = details.find(d=>d.title === "Conflict");
    conflict = conflict && conflict.body;
    let environments = personality.environments || [];

    return (
      <div class={style.details}>
        {complement && (
          <div class={style.detail}>
            <div class={style.content}>
              <div class={style.bar} style="background: #008dc7;" />
              <h4 class={style.title} style="color: #008dc7;">{this.props.translate("complements")}</h4>
              <p class={style.description}>{complement}</p>
            </div>
          </div>
        )}
        {conflict && (
          <div class={style.detail}>
            <div class={style.content}>
              <div class={style.bar} style="background: #d04e4a;" />
              <h4 class={style.title} style="color: #d04e4a;">{this.props.translate("conflicts")}</h4>
              <p class={style.description}>{conflict}</p>
            </div>
          </div>
        )}
        {environments[0] && (
          <div class={style.detail}>
            <div class={style.content}>
              <div class={style.bar} style="background: #32be4b;" />
              <h4 class={style.title} style="color: #32be4b;">{this.props.translate("best_work_environments")}</h4>
              <ul class={style.description}>
                <li>Values creativity</li>
                {environments.map(environment=>{
                  return <li>{environment.name}</li>;
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}
