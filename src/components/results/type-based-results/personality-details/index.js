import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDetails extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityDetails.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityDetails.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    let personality = this.props.assessment.personality_blend;
    personality = personality || this.props.assessment.personality_types[0];

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

export {PersonalityDetails as Component};
export default withTraitify(PersonalityDetails);
