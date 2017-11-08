import {h, Component} from "preact";
import style from "./style";

export default class PersonalityHeading extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityHeading", "initialized", this);
    if(!this.props.deckReady(this.props.deck)){ this.props.fetchDeck(); }
  }
  componentDidUpdate(){
    if(!this.props.deckReady(this.props.deck)){ this.props.fetchDeck(); }
  }
  render(){
    if(!this.props.resultsReady(this.props.assessment)) return <div />;
    if(!this.props.deckReady(this.props.deck)) return <div />;

    let personality = this.props.assessment.archetype;
    if(!personality) return <div />;

    return (
      <div class={style.personality}>
        <div class={style.content} dangerouslySetInnerHTML={{
          __html: this.props.translate("personality_heading", {
            deck_name: this.props.deck.name,
            personality: `<strong>${personality.name}</strong>`
          })
        }} />
      </div>
    );
  }
}
