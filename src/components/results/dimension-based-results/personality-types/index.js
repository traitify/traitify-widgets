import {Component} from "react";
import withTraitify from "lib/with-traitify";
import PersonalityType from "../personality-type";
import style from "./style";

class Types extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypes.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTypes.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    return (
      <ul className={style.types}>
        {this.props.assessment.personality_types.map((type)=>(
          <PersonalityType key={type.personality_type.id} type={type} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {Types as Component};
export default withTraitify(Types);
