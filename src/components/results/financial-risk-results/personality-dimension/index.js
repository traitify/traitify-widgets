import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDimension extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired
        }).isRequired,
        details: PropTypes.array.isRequired,
        level: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimension.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimension.updated", this);
  }
  render() {
    const {type: {personality_type: {badge, details, level, name}}} = this.props;
    const color = `#${badge.color_1}`;
    const characteristics = details.filter(({title}) => (title === "Characteristics")).map(({body}) => body);
    if(characteristics.length === 0) { return null; }

    const headers = {
      Low: [
        `Those with lower ${name} will tend to be less willing to take on greater financial risk`,
        `Characteristics common in lower ${name}`
      ],
      Medium: [
        `Those with medium ${name} will tend to be less willing to take on greater financial risk`,
        `Characteristics common in medium ${name}`
      ],
      High: [
        `Those with higher ${name} will tend to be more willing to take on greater financial risk`,
        `Characteristics common in higher ${name}`
      ]
    }[level];
    const perspective = this.props.getOption("perspective");
    const options = {base: {details}, perspective};

    return (
      <li className={style.dimension} style={{background: rgba(color, 10), borderTop: `5px solid ${color}`}}>
        <h2>{name} <span style={{color}}>|</span> {level}</h2>
        <h3>{headers[0]}</h3>
        <p>{detailWithPerspective({...options, name: "description"})}</p>
        <h3>{headers[1]}</h3>
        <ul className={style.characteristics}>
          {characteristics.map((characteristic) => (
            <li key={characteristic} style={{background: rgba(color, 50)}}>{characteristic}</li>
          ))}
        </ul>
      </li>
    );
  }
}

export {PersonalityDimension as Component};
export default withTraitify(PersonalityDimension);
