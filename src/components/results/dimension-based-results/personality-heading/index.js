import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import {dangerousProps} from "lib/helpers";
import style from "./style";

class PersonalityHeading extends Component {
  static defaultProps = {assessment: null, deck: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    deck: PropTypes.shape({name: PropTypes.string.isRequired}),
    followDeck: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired,
    translate: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.traitify.ui.trigger("PersonalityHeading.initialized", this);
    this.props.followDeck();
  }
  componentDidUpdate() {
    this.props.traitify.ui.trigger("PersonalityHeading.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }
    if(!this.props.isReady("deck")) { return null; }

    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }

    return (
      <div className={style.personality}>
        <div
          className={style.content}
          {...dangerousProps({
            html: this.props.translate("personality_heading", {
              deck_name: this.props.deck.name,
              personality: `<strong>${personality.name}</strong>`
            })
          })}
        />
      </div>
    );
  }
}

export {PersonalityHeading as Component};
export default withTraitify(PersonalityHeading);
