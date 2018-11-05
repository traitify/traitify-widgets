import {Component} from "react";
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
    if(!this.props.isReady("results")){ return null; }

    let personality = this.props.assessment.personality_blend;
    personality = personality || this.props.assessment.personality_types[0];

    const details = personality.details;
    if(!details){ return null; }

    let complement = details.find(d=>d.title === "Complement");
    complement = complement && complement.body;
    let conflict = details.find(d=>d.title === "Conflict");
    conflict = conflict && conflict.body;
    let environments = personality.environments || [];

    return (
      <div className={style.details}>
        {complement && (
          <div className={style.complements}>
            <h4>{this.props.translate("complements")}</h4>
            <p>{complement}</p>
          </div>
        )}
        {conflict && (
          <div className={style.conflicts}>
            <h4>{this.props.translate("conflicts")}</h4>
            <p>{conflict}</p>
          </div>
        )}
        {environments[0] && (
          <div className={style.environments}>
            <h4>{this.props.translate("best_work_environments")}</h4>
            <ul>
              {environments.map(environment=>(
                <li key={environment.name}>{environment.name}</li>
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
