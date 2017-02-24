import { h, Component } from "preact";
import style from "./style";

export default class PersonalityDetails extends Component {
  render() {
    var personality = this.props.assessment.personality_blend;
    personality = personality || this.props.assessment.personality_types[0];
    var details = personality.details;
    var complement = details.find(d => d.title == "Complement");
    complement = complement && complement.body;
    var conflict = details.find(d => d.title == "Conflict");
    conflict = conflict && conflict.body;
    var environments = personality.environments || [];
    return (
      <div class={style.details}>
        {complement && (
          <div class={style.complements}>
            <h4>Complements</h4>
            <p>{complement}</p>
          </div>
        )}
        {conflict && (
          <div class={style.conflicts}>
            <h4>Conflicts</h4>
            <p>{conflict}</p>
          </div>
        )}
        {environments[0] && (
          <div class={style.environment}>
            <h4>Best Work Environment</h4>
            <ul>
              {environments.map(environment => {
                return <li>{environment.name}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
