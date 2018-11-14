import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import PersonalityTrait from "../personality-trait";
import style from "./style";

class PersonalityTraits extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_traits: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired,
    translate: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {showMore: false};
  }
  componentDidMount() {
    this.props.traitify.ui.trigger("PersonalityTraits.initialized", this);
  }
  componentDidUpdate() {
    this.props.traitify.ui.trigger("PersonalityTraits.updated", this);
  }
  onClick = (e) => {
    e.preventDefault();

    this.setState((state) => ({showMore: !state.showMore}), () => {
      const key = this.state.showMore ? "showLess" : "showMore";

      this.props.traitify.ui.trigger(`PersonalityTraits.${key}`, this);
    });
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const text = this.props.translate(this.state.showMore ? "show_less" : "show_more");
    let traits = this.props.assessment.personality_traits;

    if(!this.state.showMore) { traits = traits.slice(0, 8); }

    return (
      <div className={style.traits}>
        {traits.map((trait) => (
          <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...this.props} />
        ))}
        <p className={style.center}>
          <button className={style.toggle} onClick={this.onClick} type="button">{text}</button>
        </p>
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
