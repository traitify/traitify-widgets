import Component from "components/traitify-component";
import style from "./style";

export default class PersonalityHeading extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityHeading.initialized", this);
    this.followAssessment();
    this.followDeck();
  }
  componentDidUpdate(){
    this.followAssessment();
    this.followDeck();
  }
  render(){
    if(!this.isReady("results")){ return; }
    if(!this.isReady("deck")){ return; }

    const personality = this.state.assessment.archetype;
    if(!personality){ return; }

    return (
      <div class={style.personality}>
        <div class={style.content} dangerouslySetInnerHTML={{
          __html: this.translate("personality_heading", {
            deck_name: this.state.deck.name,
            personality: `<strong>${personality.name}</strong>`
          })
        }} />
      </div>
    );
  }
}
