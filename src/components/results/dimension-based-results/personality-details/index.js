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

    const personality = this.props.assessment.archetype || {};
    const details = personality.details;
    if(!details){ return null; }

    let complement = details.find(d=>d.title === "Complement");
    complement = complement && complement.body;
    let conflict = details.find(d=>d.title === "Conflict");
    conflict = conflict && conflict.body;
    const environments = personality.environments || [];

    return (
      <div className={style.details}>
        {complement && (
          <div className={style.detail}>
            <div className={style.content}>
              <div className={style.bar} style={{background: "#008dc7"}} />
              <h4 className={style.title} style={{color: "#008dc7"}}>{this.props.translate("complements")}</h4>
              <p className={style.description}>{complement}</p>
            </div>
          </div>
        )}
        {conflict && (
          <div className={style.detail}>
            <div className={style.content}>
              <div className={style.bar} style={{background: "#d04e4a"}} />
              <h4 className={style.title} style={{color: "#d04e4a"}}>{this.props.translate("conflicts")}</h4>
              <p className={style.description}>{conflict}</p>
            </div>
          </div>
        )}
        {environments[0] && (
          <div className={style.detail}>
            <div className={style.content}>
              <div className={style.bar} style={{background: "#32be4b"}} />
              <h4 className={style.title} style={{color: "#32be4b"}}>{this.props.translate("best_work_environments")}</h4>
              <ul className={style.description}>
                {environments.map(environment=>(
                  <li key={environment.name}>{environment.name}</li>
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
