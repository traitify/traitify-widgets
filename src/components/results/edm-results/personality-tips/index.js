import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

const tipTypes = [
  {disabledKey: "PersonalityTools", key: "tools", title: "Tools to Use"},
  {disabledKey: "PersonalityRoom", key: "room", title: "Room for Growth and Change"},
  {disabledKey: "PersonalitySettings", key: "settings", title: "Settings that Work for You"}
];

class PersonalityTips extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTips.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTips.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const {translate} = this.props;
    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }

    const disabledComponents = this.props.getOption("disabledComponents") || [];
    const activeTipTypes = tipTypes.filter((type) => {
      if(disabledComponents.includes(type.disabledKey)) { return false; }

      return personality.details.find(({title}) => (title === type.title));
    });
    if(activeTipTypes.length === "") { return null; }

    const activeType = activeTipTypes[0];
    const onChange = () => {};
    const tips = personality.details
      .filter(({title}) => (title === activeType.title))
      .map(({body}) => body);
    const typeStyle = {width: `${100.0 / activeTipTypes.length}%`};

    return (
      <div className={style.container}>
        <ul className={style.tipsTabs}>
          {activeTipTypes.map(({key}) => (
            <li key={key} className={activeType.key === key ? style.active : ""} style={typeStyle}>
              <button type="button">
                <div className={style.tipName}>{translate(`tip_type_for_${key}`)}</div>
              </button>
            </li>
          ))}
        </ul>
        <div className={style.tipsTabBox}>
          <div className={style.formSelect}>
            <select onChange={onChange} value={activeType.key}>
              {activeTipTypes.map(({key}) => (
                <option key={key} value={key}>{translate(`tip_type_for_${key}`)}</option>
              ))}
            </select>
          </div>
          <ul className={style.tips}>
            {tips.map((tip) => (<li key={tip}>{tip}</li>))}
          </ul>
        </div>
      </div>
    );
  }
}

export {PersonalityTips as Component};
export default withTraitify(PersonalityTips);
