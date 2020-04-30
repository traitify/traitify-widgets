import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityTypeSlide extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.object.isRequired,
      score: PropTypes.number.isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {activeType: null};
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTypeSlide.initialized", this);
    this.props.ui.on("Assessment.activeType", this.getActiveType);

    const activeType = this.props.ui.current["Assessment.activeType"];
    if(activeType) { this.setState({activeType}); }
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTypeSlide.updated", this);
  }
  componentWillUnmount() {
    this.props.ui.off("Assessment.activeType", this.getActiveType);
  }
  getActiveType = () => {
    this.setState({activeType: this.props.ui.current["Assessment.activeType"]});
  }
  render() {
    const {activeType} = this.state;
    const type = this.props.type.personality_type;

    if(!activeType) { return null; }
    if(type.id !== activeType.personality_type.id) { return null; }

    const color = `#${type.badge.color_1}`;
    const position = "middle";
    let description = detailWithPerspective({
      base: type,
      name: "description",
      perspective: this.props.getOption("perspective")
    });

    let name;
    if(description[0] === "'") {
      name = description.split("'")[1];
      description = description.split("'").splice(2).join("'");
    } else {
      name = type.name;
      description = `- ${description}`;
    }

    return (
      <li className={`${style.slide} ${style[position]}`} style={{background: rgba(color, 8.5)}}>
        <span className={style.title} style={{color}}>{name}</span>
        {description}
      </li>
    );
  }
}

export {PersonalityTypeSlide as Component};
export default withTraitify(PersonalityTypeSlide);
