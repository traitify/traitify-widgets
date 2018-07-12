import Component from "components/traitify-component";
import TypeBasedResults from "./type-based-results";
import DimensionBasedResults from "./dimension-based-results";

export default class Results extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("Results.initialized", this);

    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();

    return (this.state.assessment.assessment_type === "TYPE_BASED") ? (
      <TypeBasedResults options={options} />
    ) : (
      <DimensionBasedResults options={options} />
    );
  }
}
