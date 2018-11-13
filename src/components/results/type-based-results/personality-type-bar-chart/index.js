import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import PersonalityTypeBar from "../personality-type-bar";
import style from "./style";

class PersonalityTypeBarChart extends Component{
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired
  }
  constructor(props){
    super(props);

    this.state = {activeType: null};
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypeBarChart.initialized", this);
    this.props.traitify.ui.on("Assessment.activeType", this.getActiveType);
    this.activate();
  }
  componentDidUpdate(){
    this.activate();
    this.props.traitify.ui.trigger("PersonalityTypeBarChart.updated", this);
  }
  componentWillUnmount(){
    this.props.traitify.ui.off("Assessment.activeType", this.getActiveType);
  }
  getActiveType = ()=>{
    this.setState({activeType: this.props.traitify.ui.current["Assessment.activeType"]});
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
    if(!this.props.isReady("results")){ return null; }

    return (
      <ul className={style.chart}>
        {this.props.assessment.personality_types.map((type)=>(
          <PersonalityTypeBar
            key={type.personality_type.id}
            type={type}
            barHeight={this.barHeight(type)}
            {...this.props}
          />
        ))}
      </ul>
    );
  }
}

export {PersonalityTypeBarChart as Component};
export default withTraitify(PersonalityTypeBarChart);
