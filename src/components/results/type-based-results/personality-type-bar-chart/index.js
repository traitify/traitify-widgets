import Component from "components/traitify-component";
import PersonalityTypeBar from "../personality-type-bar";
import style from "./style";

export default class PersonalityTypeBarChart extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTypeBarChart.initialized", this);
    this.traitify.ui.on("Assessment.activeType", ()=>{
      this.setState({activeType: this.traitify.ui.data["Assessment.activeType"]});
    });
    this.followAssessment();
    this.activate();
  }
  componentDidUpdate(){
    this.followAssessment();
    this.activate();
  }
  activate(){
    if(!this.isReady("results")){ return; }
    if(this.state.activeType){ return; }

    const activeType = this.traitify.ui.data["Assessment.activeType"];
    if(activeType){
      this.setState({activeType});
    }else{
      const type = this.state.assessment.personality_types[0];

      this.traitify.ui.trigger("Assessment.activeType", this, type);
    }
  }
  barHeight(type){
    const maxScore =  this.state.assessment.personality_types[0].score;
    const score = (100 - (maxScore - type.score)) - 5;

    return score > 0 ? score : 0;
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();

    return (
      <ul class={style.chart}>
        {this.state.assessment.personality_types.map((type)=>(
          <PersonalityTypeBar type={type} barHeight={this.barHeight(type)} options={options} />
        ))}
      </ul>
    );
  }
}
