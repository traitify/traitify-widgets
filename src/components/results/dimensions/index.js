import { h, Component } from "preact";
import Dimension from "../dimension";
import style from "./style";

export default class Dimensions extends Component {
  render() {
    var dimensions = [
      {
        name: "Agreeableness",
        score: "3 - Low",
        description: "You describe yourself as someone who is questioning of other people and their views. This suggests you can be quite a skeptical person, who needs to be convinced of a person's integrity before building a relationship with them. In your book, it would seem that loyalty has to be earned. Your results indicate that you are an independent-minded person who is quite willing to pursue your own agenda. When it comes to your dealings with other people, you are likely to push for what you want and tend to be competitive and at times impersonal. This means you will probably come across as being firm-minded and not easily swayed by feelings of sympathy for others. You are likely to be quite happy to confront things head on, and can cope with criticism.",
        color: "#40B574",
        icon: "https://cdn.traitify.com/assets/images/big-five_agreeableness.svg",
        benefits: ["Questioning", "Questioning", "Questioning"],
        pitfalls: ["May over-prioritize logic over feeling", "May over-prioritize logic over feeling", "May over-prioritize logic over feeling"]
      },
      {
        name: "Disagreeable",
        score: "8 - High",
        description: "You describe yourself as someone who is questioning of other people and their views. This suggests you can be quite a skeptical person, who needs to be convinced of a person's integrity before building a relationship with them. In your book, it would seem that loyalty has to be earned. Your results indicate that you are an independent-minded person who is quite willing to pursue your own agenda. When it comes to your dealings with other people, you are likely to push for what you want and tend to be competitive and at times impersonal. This means you will probably come across as being firm-minded and not easily swayed by feelings of sympathy for others. You are likely to be quite happy to confront things head on, and can cope with criticism.",
        color: "#666666",
        icon: "https://cdn.traitify.com/assets/images/big-five_agreeableness.svg",
        benefits: ["Answering", "Answering", "Questioning"],
        pitfalls: ["May Eat Kitties", "May over-prioritize logic over feeling"]
      }
    ]
    var context = this;
    return (
      <section>
        <ul class={style.dimensions}>
          {dimensions.map(function(dimension, i) {
            return <Dimension dimension={dimension} index={i} {...context.props} />
          })}
        </ul>
      </section>
    );
  }
}
