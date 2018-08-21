import {Component} from "preact";
import Caption from "../caption";
import Response from "../response";
import style from "./style";

export default class Instructions extends Component{
  render(){
    const {start, translate} = this.props;

    return (
      <div class={style.container}>
        <Caption caption={translate("instructions")} progress={0} />
        <div class={style.text}>
          <p>Go with your gut and answer <strong>honestly</strong>, then it is far more likely we will see what makes you unique. There is not one <em>right</em> answer. The best approach to this questionnaire is just to be you!</p>
          <p>For each image, simply click <strong>"Me"</strong> if the image describes how you generally are and <strong>"Not Me"</strong> if it does not.</p>
          <p>This questionnaire will take just a couple of minutes to complete.</p>
          <p>Be aware, we may cross-check your answers.</p>
        </div>
        <Response>
          <button class={style.button} onClick={start}>
            {translate("get_started")}
          </button>
        </Response>
      </div>
    );
  }
}
