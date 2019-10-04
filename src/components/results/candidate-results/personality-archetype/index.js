import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
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
    // TODO: Get badge from details
    // const badge = personality.details.find(({title}) => title === "Badge").body;
    const badge = "https://cdn.traitify.com/frtq/conservative_white.png";
    const options = {base: personality, perspective: "firstPerson"};

    return (
      <div className={style.container}>
        <div className={style.details}>
          <img alt={personality.name} src={badge} />
          <DangerousHTML
            html={this.props.translate("personality_heading", {
              deck_name: this.props.deck.name,
              personality: `<span>${personality.name}</span>`
            })}
            tag="h2"
          />
          <p>{detailWithPerspective({...options, name: "Description"})}</p>
        </div>
        <div className={style.meaning}>
          <DangerousHTML html={this.props.translate("candidate_description_for_archetype_html")} tag="p" />
        </div>
      </div>
    );
  }
}

export {PersonalityArchetype as Component};
export default withTraitify(PersonalityArchetype);
