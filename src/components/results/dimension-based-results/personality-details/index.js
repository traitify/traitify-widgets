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

    const personality = this.props.assessment.archetype || {};
    const details = personality.details;
    if(!details){ return; }

    let complement = details.find(d=>d.title === "Complement");
    complement = complement && complement.body;
    let conflict = details.find(d=>d.title === "Conflict");
    conflict = conflict && conflict.body;
    const environments = personality.environments || [];

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
                {environments.map(environment=>(
                  <li>{environment.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export {PersonalityDetails as Component};
export default withTraitify(PersonalityDetails);
