import Component from "components/traitify-component";
import Dimension from "../dimension";
import style from "./style";

export default class Dimensions extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("Dimensions.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();

    return (
      <ul class={style.dimensions}>
        {this.state.assessment.personality_types.map((type, i)=>{
          return <Dimension type={type} index={i} options={options} />;
        })}
      </ul>
    );
  }
}
