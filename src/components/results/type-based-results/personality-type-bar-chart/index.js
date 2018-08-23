import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityTypeBar from "../personality-type-bar";
import style from "./style";

class PersonalityTypeBarChart extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypeBarChart.initialized", this);
    this.props.traitify.ui.on("Assessment.activeType", ()=>{
      this.setState({activeType: this.props.traitify.ui.current["Assessment.activeType"]});
    });
    this.activate();
  }
  componentDidUpdate(){
    this.activate();
    this.props.traitify.ui.trigger("PersonalityTypeBarChart.updated", this);
  }
  activate(){
    if(!this.props.isReady("results")){ return; }
    if(this.state.activeType){ return; }

    const activeType = this.props.traitify.ui.current["Assessment.activeType"];
    if(activeType){
      this.setState({activeType});
    }else{
      const type = this.props.assessment.personality_types[0];

      this.props.traitify.ui.trigger("Assessment.activeType", this, type);
    }
  }
  barHeight(type){
    const maxScore = this.props.assessment.personality_types[0].score;
    const score = (100 - (maxScore - type.score)) - 5;

    return score > 0 ? score : 0;
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    return (
      <ul class={style.chart}>
        {this.props.assessment.personality_types.map((type)=>(
          <PersonalityTypeBar type={type} barHeight={this.barHeight(type)} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {PersonalityTypeBarChart as Component};
export default withTraitify(PersonalityTypeBarChart);
