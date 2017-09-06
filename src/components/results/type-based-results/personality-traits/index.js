import {h, Component} from "preact";
import style from "./style";

import PersonalityTrait from "../personality-trait";

export default class PersonalityTraits extends Component{
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount(){
    this.props.triggerCallback("PersonalityTraits", "initialized", this);
  }
  onClick(e){
    e.preventDefault();
    let callback = this.state.showMore ? "showLess" : "showMore";
    this.props.triggerCallback("PersonalityTraits", callback, this);
    this.setState({showMore: !this.state.showMore});
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let traits = this.props.assessment.personality_traits;
    let text = this.props.translate(this.state.showMore ? "show_less" : "show_more");
    if(!this.state.showMore) traits = traits.slice(0, 8);
    return (
      <div class={style.traits}>
        {traits.map((trait)=>{
          return <PersonalityTrait trait={trait} />;
        })}
        <p class={style.center}>
          <a href="#" class={style.toggle} onClick={this.onClick}>{text}</a>
        </p>
      </div>
    );
  }
}
