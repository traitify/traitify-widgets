import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class Type extends Component{
  static propTypes = {
    type: PropTypes.shape({
      personality_type: PropTypes.object.isRequired,
      score: PropTypes.number.isRequired
    }).isRequired,
    traitify: TraitifyPropType.isRequired
  }
  trigger = (e)=>{
    e.preventDefault();

    this.props.traitify.ui.trigger("PersonalityType.showContent", this, this.props.type.personality_type);
    this.setState((state)=>({showContent: !state.showContent}));
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityType.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityType.updated", this);
  }
  render(){
    const type = this.props.type.personality_type;
    const color = `#${type.badge.color_1}`;

    return (
      <li className={style.type} style={{borderLeft: `5px solid ${color}`}}>
        <div className={style.main} style={{background: rgba(color, 8.5)}}>
          <div className={style.content}>
            <h2 className={style.title}>
              {type.name}
              <span className={style.score}>{this.props.type.score} - {type.level}</span>
            </h2>
          </div>
        </div>
      </li>
    );
  }
}

export {Type as Component};
export default withTraitify(Type);
