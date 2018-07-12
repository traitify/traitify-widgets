import Component from "components/traitify-component";
import Results from "./results";
import SlideDeck from "./slide-deck";

export default class Default extends Component{
  componentDidMount(){
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(this.isReady("results")){
      return <Results {...this.props} />;
    }
    if(this.isReady("slides")){
      return <SlideDeck {...this.props} />;
    }

    return <div />;
  }
}
