import { h, Component } from "preact";
import style from "./style";

export default class PersonalityDetails extends Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}
