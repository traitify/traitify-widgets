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
			<div class={style.wrapper}>
				<div class={style.row}>
					<section class={style.tiles}>
						<div class={style.tile}>
							<h4 class={style.title}>Tap the personalities to learn about each one</h4>
							<h4 class={style.title}>Hover over the personalities to learn about each one</h4>
						</div>
						{personalityTypes.map(function(personalityType, i) {
							return <PersonalityType personalityType={personalityType} index={i} {...context.props} />
						})}

						<h4>Personality Traits (Measured on a scale of 0% to 100%)</h4>
						<div class={style.trait} style="background: #fff3ed;">
							<div class={style.traitBar} style="width: 98%; background: #f66c0f;"></div>
							<div class={style.traitContent}>
								<div class={style.traitScore}>98%</div>
								<img src='//placehold.it/100x100' alt='Type Name icon' class={style.traitIcon} />
								<h3 class={style.traitName}>Trait Name
								<span class={style.traitDescription}>feeling compelled, by a strong impulse, to act or behave in a certain way, which is usually repetitive</span>
								</h3>
							</div>
						</div>
						<div class={style.trait} style="background: #e7fefa;">
							<div class={style.traitBar} style="width: 85%; background: #00e5bc;"></div>
							<div class={style.traitContent}>
								<div class={style.traitScore}>85%</div>
								<img src='//placehold.it/100x100' alt='Type Name icon' class={style.traitIcon} />
								<h3 class={style.traitName}>Trait Name
								<span class={style.traitDescription}>prefers what is known and routine</span>
								</h3>
							</div>
						</div>

						<p class={style.center}>
							<a href="#" class={style.moreTraits}>View More Traits</a>
						</p>

						<div class={style.complements}>
							<h4>Complements</h4>
							<p>Lorem obcaecati nesciunt architecto recusandae eum quisquam. Eligendi ducimus tenetur illo dolore dolorum! Sed perferendis qui provident exercitationem natus voluptas molestias a Incidunt assumenda totam cumque itaque ipsam numquam!</p>
						</div>

						<div class={style.conflicts}>
							<h4>Conflicts</h4>
							<p>Lorem obcaecati nesciunt architecto recusandae eum quisquam. Eligendi ducimus tenetur illo dolore dolorum! Sed perferendis qui provident exercitationem natus voluptas molestias a Incidunt assumenda totam cumque itaque ipsam numquam!</p>
						</div>

						<div class={style.environment}>
							<h4>Best Work Environment</h4>
							<ul>
								<li>Allows for independent study and peer collaboration</li>
								<li>Is fast-paced</li>
								<li>Offers clear opportunities for career advancement</li>
								<li>Requires an academic speciality</li>
							</ul>
						</div>

					</section>
				</div>
			</div>
    );
  }
}
