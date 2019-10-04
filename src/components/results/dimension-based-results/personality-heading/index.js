import PropTypes from "prop-types";
import {Component} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityHeading extends Component {
  static defaultProps = {assessment: null, deck: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    deck: PropTypes.shape({name: PropTypes.string.isRequired}),
    followDeck: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityHeading.initialized", this);
    this.props.followDeck();
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityHeading.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }
    if(!this.props.isReady("deck")) { return null; }

    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }

    return (
      <div className={style.personality}>
        <DangerousHTML
          className={style.content}
          html={this.props.translate("personality_heading", {
            deck_name: this.props.deck.name,
            personality: `<strong>${personality.name}</strong>`
          })}
        />
      </div>
    );
  }
}

export {PersonalityHeading as Component};
export default withTraitify(PersonalityHeading);
