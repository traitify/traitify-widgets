import { h, Component } from "preact";
import style from "./style";
import PersonalityType from "../personality-type";

export default class PersonalityTypes extends Component {
  render() {
    // this.props.assessment.personality_types
    var personalityTypes = [
      {
        personality_type: {
          name: "Planner",
          description: "'Planners'...are the detail people. They are methodical, precise, and detail-oriented. Planners create systems to follow, and enjoy working with data, detail, words and numbers. Great at manipulating data, they love procedure and routine. Often found in office settings, they excel at completing detailed work in an organized manner.",
          badge: { color_1: "#f7d00f" }
        },
        score: "55"
      },
      {
        personality_type: {
          name: "Mentor",
          description: "'Mentors'...are people-oriented. They have great communication skills and are most fulfilled when assisting or working directly with others to improve a personal or societal situation. Mentors are patient and compassionate and work best in a group or on a team with a common goal. Mentors excel at working with others to help them learn and grow.",
          badge: { color_1: "#ed4343" }
        },
        score: "53"
      }
    ]
    var context = this;
    return (
      <section class={style.tiles}>
        <div class={style.tile}>
          <h4 class={style.title}>Tap the personalities to learn about each one</h4>
          <h4 class={style.title}>Hover over the personalities to learn about each one</h4>
        </div>
        {personalityTypes.map(function(personalityType, i) {
          return <PersonalityType personalityType={personalityType} index={i} {...context.props} />
        })}
      </section>
    );
  }
}
