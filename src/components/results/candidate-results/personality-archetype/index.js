import PropTypes from "prop-types";
import {Component} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityArchetype extends Component {
  static defaultProps = {assessment: null, deck: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    deck: PropTypes.shape({name: PropTypes.string.isRequired}),
    followDeck: PropTypes.func.isRequired,
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    options: PropTypes.shape({archetype: PropTypes.object}).isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityArchetype.initialized", this);
    this.props.followDeck();
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityArchetype.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }
    if(!this.props.isReady("deck")) { return null; }
    const disabledComponents = this.props.getOption("disabledComponents") || [];
    if(disabledComponents.includes("PersonalityArchetype")) { return null; }
    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }
    const badge = personality.details.find(({title}) => title === "Badge");
    const perspective = this.props.getOption("perspective");
    const description = (
      perspective === "thirdPerson"
        ? personality.details.find(({title}) => title === "Hiring Manager Description")
        : personality.details.find(({title}) => title === "Candidate Description")
    );

    return (
      <div>
        {perspective === "thirdPerson"
          ? (
            <div className={style.container}>
              <div className={style.thirdPersonDetails}>
                <div className={style.itemOne}>
                  {badge && <img alt={personality.name} src={badge.body} />}
                  <div className={style.deckAndHeading}>
                    <DangerousHTML
                      html={this.props.translate("personality_heading", {
                        deck_name: this.props.deck.name,
                        personality: ""
                      })}
                      className={style.personalityHeading}
                      tag="h2"
                    />
                    <h2><span>{personality.name}</span></h2>
                  </div>
                </div>
                {description && <span className={style.itemTwo}>{description.body}</span>}
              </div>
            </div>
          )
          : (
            <div className={style.container}>
              <div className={style.details}>
                {badge && <img alt={personality.name} src={badge.body} />}
                <DangerousHTML
                  html={this.props.translate("personality_heading", {
                    deck_name: this.props.deck.name,
                    personality: `<span>${personality.name}</span>`
                  })}
                  tag="h2"
                />
                {description && <p>{description.body}</p>}
              </div>
              <div className={style.meaning}>
                <DangerousHTML html={this.props.translate("candidate_description_for_archetype_html")} tag="p" />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export {PersonalityArchetype as Component};
export default withTraitify(PersonalityArchetype);
