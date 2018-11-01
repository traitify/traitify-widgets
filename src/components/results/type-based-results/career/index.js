import {Component} from "react";
import withTraitify from "lib/with-traitify";
import style from "./style";

class Career extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("Career.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("Career.updated", this);
  }
  openModal = ()=>{
    this.props.traitify.ui.trigger("CareerModal.career", this, this.props.career);
    this.props.traitify.ui.trigger("CareerModal.show", this);
  }
  render(){
    const {career, translate} = this.props;

    return (
      <div className={style.container} onClick={this.openModal}>
        <img alt={career.title} src={career.picture} />
        <div className={style.content}>
          <h2 className={style.title}>{career.title}</h2>
          <p className={style.description}>{career.description}</p>
          <h3 className={style.subtitle}>{translate("experience_level")}</h3>
          <ol className={style.experience}>
            {[1, 2, 3, 4, 5].map((level)=>(
              <li key={level} className={career.experience_level.id >= level ? style.active : ""} />
            ))}
          </ol>
          <h3 className={style.subtitle}>{translate("education")}</h3>
          <p className={style.education}>{translate(`experience_level_${career.experience_level.id}`)}</p>
          <h3 className={style.subtitle}>
            {translate("match_rate")}
            <i className={style.matchRatePercent}>{Math.round(career.score)}%</i>
          </h3>
          <div className={style.matchRate}>
            <span data-match-rate={`${career.score}%`} style={{width: `${career.score}%`}} />
          </div>
        </div>
      </div>
    );
  }
}

export {Career as Component};
export default withTraitify(Career);
