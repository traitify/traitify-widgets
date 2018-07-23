import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityHeading extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityHeading.initialized", this);
    this.props.followDeck();
  }
  render(){
    if(!this.props.isReady("results")){ return; }
    if(!this.props.isReady("deck")){ return; }

    const personality = this.props.assessment.archetype;
    if(!personality){ return; }

    return (
      <div class={style.personality}>
        <div class={style.content} dangerouslySetInnerHTML={{
          __html: this.props.i18n.translate("personality_heading", {
            deck_name: this.props.deck.name,
            personality: `<strong>${personality.name}</strong>`
          })
        }} />
      </div>
    );
  }
}

export {PersonalityHeading as Component};
export default withTraitify(PersonalityHeading);
