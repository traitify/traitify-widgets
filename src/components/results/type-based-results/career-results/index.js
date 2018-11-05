import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Career from "../career";
import style from "./style";

class CareerResults extends Component{
  constructor(props){
    super(props);

    this.state = {
      careers: [],
      fetching: false,
      moreCareers: false
    };
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("CareerResults.initialized", this);
    this.props.traitify.ui.on("Careers.fetch", this.fetch);
    this.props.traitify.ui.on("Careers.fetching", this.fetching);
    this.props.traitify.ui.on("Careers.mergeParams", this.mergeParams);
    this.props.traitify.ui.on("Careers.updateParams", this.updateParams);

    if(!this.props.traitify.ui.current["Careers.fetch"]){
      this.props.traitify.ui.trigger("Careers.fetch", this, {});
    }
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("CareerResults.updated", this);
  }
  componentWillUnmount(){
    this.props.traitify.ui.off("Careers.fetch", this.fetch);
    this.props.traitify.ui.off("Careers.fetching", this.fetching);
    this.props.traitify.ui.off("Careers.mergeParams", this.mergeParams);
    this.props.traitify.ui.off("Careers.updateParams", this.updateParams);
  }
  careerOption = (name)=>{
    if(this.props[name] != null){ return this.props[name]; }
    if(this.props.options
      && this.props.options.careerOptions
      && this.props.options.careerOptions[name] != null
    ){ return this.props.options.careerOptions[name]; }
    if(this.traitify
      && this.traitify.ui.options.careerOptions
      && this.traitify.ui.options.careerOptions[name] != null
    ){ return this.traitify.ui.options.careerOptions[name]; }
  }
  fetch = ()=>{
    if(this.props.traitify.ui.current["Careers.fetching"]){
      const previousRequest = this.props.traitify.ui.current["Careers.request"];
      previousRequest && previousRequest.xhr && previousRequest.xhr.abort();
    }

    const path = this.careerOption("path") || `/assessments/${this.props.assessmentID}/matches/careers`;
    const params = {
      careers_per_page: this.careerOption("perPage") || 20,
      locale_key: this.props.locale,
      paged: true,
      ...this.props.traitify.ui.current["Careers.fetch"]
    };

    this.props.traitify.ui.trigger("Careers.fetching", this, true);
    this.props.traitify.ui.trigger("Careers.request", this,
      this.props.traitify.get(path, params).then((response)=>{
        const previousCareers = (params.page > 1) ? this.state.careers : [];

        this.props.traitify.ui.trigger("Careers.fetching", this, false);
        this.setState({
          careers: previousCareers.concat(response),
          moreCareers: response.length >= params.careers_per_page
        });
      })
    );
  }
  fetching = ()=>{
    this.setState({fetching: this.props.traitify.ui.current["Careers.fetching"]});
  }
  mergeParams = ()=>{
    this.props.traitify.ui.trigger("Careers.fetch", this, {
      ...this.props.traitify.ui.current["Careers.fetch"],
      ...this.props.traitify.ui.current["Careers.mergeParams"]
    });
  }
  showMore = ()=>{
    if(this.props.traitify.ui.current["Careers.fetching"]){ return; }
    const params = this.props.traitify.ui.current["Careers.fetch"] || {};
    const page = (params.page || 1) + 1;

    this.props.traitify.ui.trigger("Careers.mergeParams", this, {page});
  }
  updateParams = ()=>{
    this.props.traitify.ui.trigger("Careers.fetch", this, {
      ...this.props.traitify.ui.current["Careers.updateParams"]
    });
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    const {careers, fetching, moreCareers} = this.state;
    const {translate} = this.props;

    return (
      <div className={style.container}>
        {careers.map((career)=>(<Career key={career.career.id} career={{score: career.score, ...career.career}} {...this.props} />))}
        <p className={style.center}>
          {fetching && <span>{translate("loading")}</span>}
          {!fetching && [
            moreCareers && (
              <button key="more" className={style.more} onClick={this.showMore} type="button">{translate("show_more")}</button>
            ),
            (careers.length === 0 && <span key="none">{translate("no_careers")}</span>),
            (careers.length > 0 && !moreCareers && <span key="done">{translate("no_more_careers")}</span>)
          ]}
        </p>
      </div>
    );
  }
}

export {CareerResults as Component};
export default withTraitify(CareerResults);
