import Component from "components/traitify-component";
import style from "./style";

export default class PersonalityDetails extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityDetails.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    let personality = this.state.assessment.personality_blend;
    personality = personality || this.state.assessment.personality_types[0];

    const details = personality.details;
    if(!details) return;

    let complement = details.find(d=>d.title === "Complement");
    complement = complement && complement.body;
    let conflict = details.find(d=>d.title === "Conflict");
    conflict = conflict && conflict.body;
    let environments = personality.environments || [];

    return (
      <div class={style.details}>
        {complement && (
          <div class={style.complements}>
            <h4>{this.translate("complements")}</h4>
            <p>{complement}</p>
          </div>
        )}
        {conflict && (
          <div class={style.conflicts}>
            <h4>{this.translate("conflicts")}</h4>
            <p>{conflict}</p>
          </div>
        )}
        {environments[0] && (
          <div class={style.environments}>
            <h4>{this.translate("best_work_environments")}</h4>
            <ul>
              {environments.map(environment=>(
                <li>{environment.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
