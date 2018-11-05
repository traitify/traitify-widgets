import {Component} from "react";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityHeading extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityHeading.initialized", this);
    this.props.followDeck();
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityHeading.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return null; }
    if(!this.props.isReady("deck")){ return null; }

    const personality = this.props.assessment.archetype;
    if(!personality){ return null; }

    return (
      <div className={style.personality}>
        <div className={style.content} dangerouslySetInnerHTML={{
          __html: this.props.translate("personality_heading", {
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
