import {h, Component} from "preact";
import style from "./style";

export default class PersonalityDetails extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityDetails", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let personality = this.props.assessment.personality_blend;
    personality = personality || this.props.assessment.personality_types[0];
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
          <div class={style.complements}>
            <h4>{this.props.translate("complements")}</h4>
            <p>{complement}</p>
          </div>
        )}
        {conflict && (
          <div class={style.conflicts}>
            <h4>{this.props.translate("conflicts")}</h4>
            <p>{conflict}</p>
          </div>
        )}
        {environments[0] && (
          <div class={style.environments}>
            <h4>{this.props.translate("best_work_environments")}</h4>
            <ul>
              {environments.map(environment=>{
                return <li>{environment.name}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
