import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityTypeSlide from "../personality-type-slide";
import TypeButton from "./type-button";
import style from "./style";

class PersonalityTypeSlider extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {activeType: null};
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTypeSlider.initialized", this);
    this.props.ui.on("Assessment.activeType", this.getActiveType);

    const activeType = this.props.ui.current["Assessment.activeType"];
    if(activeType) { this.setState({activeType}); }
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTypeSlider.updated", this);
  }
  componentWillUnmount() {
    this.props.ui.off("Assessment.activeType", this.getActiveType);
  }
  getActiveType = () => {
    this.setState({activeType: this.props.ui.current["Assessment.activeType"]});
  }
  setActive = (type) => {
    this.props.ui.trigger("PersonalityTypeSlider.changeType", this, type);
    this.props.ui.trigger("Assessment.activeType", this, type);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const {activeType} = this.state;
    const {assessment: {personality_types: personalityTypes}, translate} = this.props;

    let backType;
    let nextType;
    if(activeType) {
      const {id} = activeType.personality_type;
      const index = personalityTypes.findIndex((type) => type.personality_type.id === id);
      backType = personalityTypes[index - 1];
      nextType = personalityTypes[index + 1];
    }

    return (
      <div className={style.slider}>
        {backType && (
          <TypeButton className={style.back} type={backType} setActive={this.setActive}>
            <img src="https://cdn.traitify.com/assets/images/js/arrow_left.svg" alt={translate("back")} />
          </TypeButton>
        )}
        <ul>
          {personalityTypes.map((type) => (
            <PersonalityTypeSlide key={type.personality_type.id} type={type} {...this.props} />
          ))}
        </ul>
        {nextType && (
          <TypeButton className={style.next} type={nextType} setActive={this.setActive}>
            <img src="https://cdn.traitify.com/assets/images/js/arrow_right.svg" alt={translate("next")} />
          </TypeButton>
        )}
      </div>
    );
  }
}

export {PersonalityTypeSlider as Component};
export default withTraitify(PersonalityTypeSlider);
