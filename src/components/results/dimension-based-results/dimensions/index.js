import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import Dimension from "../dimension";
import style from "./style";

class Dimensions extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("Dimensions.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    return (
      <ul class={style.dimensions}>
        {this.props.assessment.personality_types.map((type, i)=>(
          <Dimension type={type} index={i} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {Dimensions as Component};
export default withTraitify(Dimensions);
