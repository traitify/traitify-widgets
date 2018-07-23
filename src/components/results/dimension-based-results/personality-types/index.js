import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityType from "../personality-type";
import style from "./style";

class Types extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypes.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    return (
      <ul class={style.types}>
        {this.props.assessment.personality_types.map((type)=>(
          <PersonalityType type={type} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {Types as Component};
export default withTraitify(Types);
