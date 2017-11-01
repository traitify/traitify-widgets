import {h, Component} from "preact";
import style from "./style";

export default class PersonalityHeading extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityHeading", "initialized", this);
    if(!this.props.deckReady()){ this.props.fetchDeck(); }
  }
  componentDidUpdate(){
    if(!this.props.deckReady()){ this.props.fetchDeck(); }
  }
  render(){
    if(!this.props.resultsReady()) return <div />;
    if(!this.props.deckReady()) return <div />;

    // TODO: Replace Personality
    const personality = this.props.assessment.personality_types[0].personality_type.name;

    return (
      <div class={style.personality}>
        <div class={style.content} dangerouslySetInnerHTML={{
          __html: this.props.translate("personality_heading", {
            deck_name: this.props.deck.name,
            personality: `<strong>${personality}</strong>`
          })
        }} />
      </div>
    );
  }
}
