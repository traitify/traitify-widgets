import {
  faCheckSquare,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Icon from "lib/helpers/icon";
import style from "./style";

class CareerFilter extends Component{
  constructor(props){
    super(props);

    this.state = {
      params: {},
      showFilters: false
    };
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("CareerFilter.initialized", this);
    this.props.traitify.ui.on("Careers.mergeParams", this.mergeParams);
    this.props.traitify.ui.on("Careers.updateParams", this.updateParams);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("CareerFilter.updated", this);
  }
  componentWillUnmount(){
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
  mergeParams = ()=>{
    this.setState({
      params: {
        ...this.state.params,
        ...this.props.traitify.ui.current["Careers.mergeParams"]
      }
    });
  }
  toggleFilters = (e)=>{
    if(e.target.tagName.toLowerCase() === "i"){ this.setState({showFilters: !this.state.showFilters}); }
  }
  updateParams = ()=>{
    this.setState({
      params: {...this.props.traitify.ui.current["Careers.updateParams"]}
    });
  }
  onChange = (e)=>{
    let params = {...this.state.params};
    const {name, value} = e.target;

    params[name] = value;

    this.setState({params});
  }
  onExperienceChange = (e)=>{
    const value = +e.target.value;
    const defaultLevels = this.careerOption("experienceLevels") || [1, 2, 3, 4, 5];
    let params = {...this.state.params};
    let levels = params.experience_levels;
    levels = levels ? levels.split(",").map((level)=>(+level)) : defaultLevels;

    if(levels.includes(value)){
      levels = levels.filter((l)=>(l !== value));
      if(levels.length === 0){ levels = defaultLevels; }
    }else{
      levels.push(value);
    }

    params.experience_levels = levels.sort().join(",");

    this.setState({params});
  }
  onSubmit = (e)=>{
    e.preventDefault();

    this.props.traitify.ui.trigger("Careers.mergeParams", this, {
      ...this.state.params,
      page: 1
    });

    return false;
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    const {params, showFilters} = this.state;
    const {translate} = this.props;
    const experienceLevels = this.careerOption("experienceLevels") || [1, 2, 3, 4, 5];
    const currentExperienceLevels = params.experience_levels || experienceLevels;
    const currentSort = params.sort || "match";
    const currentSearch = params.search || "";

    return (
      <div className={style.container}>
        <form onSubmit={this.onSubmit}>
          <ul>
            <li className={style.search}>
              <label className={style.label} htmlFor="traitify-career-search">{translate("search")}</label>
              <input className={style.field} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={this.onChange}/>
            </li>
            <li onClick={this.toggleFilters}>
              <div className={`${style.fieldGroup} ${style.field}`}>
                <i>{translate("filter")}</i>
                <ul className={`${style.formGroup} ${showFilters ? style.block : ""}`}>
                  <div>
                    <li className={style.groupTitle}>{translate("sort")}</li>
                    <li>
                      <label htmlFor="traitify-career-sort-match">
                        <input aria-labelledby="traitify-career-sort-match-label" checked={currentSort === "match"} className={style.check} id="traitify-career-sort-match" name="sort" type="radio" onChange={this.onChange} value="match" />
                        <Icon icon={currentSort === "match" ? faCheckSquare : faSquare} />
                        <span id="traitify-career-sort-match-label">{translate("best_match")}</span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="traitify-career-sort-title">
                        <input aria-labelledby="traitify-career-sort-title-label" checked={currentSort === "title"} className={style.check} id="traitify-career-sort-title" name="sort" type="radio" onChange={this.onChange} value="title" />
                        <Icon icon={currentSort === "title" ? faCheckSquare : faSquare} />
                        <span id="traitify-career-sort-title-label">{translate("title")}</span>
                      </label>
                    </li>
                  </div>
                  <div>
                    <li className={style.groupTitle}>{translate("experience_level")}</li>
                    {experienceLevels.map((level)=>(
                      <li key={level}>
                        <label htmlFor={`traitify-career-level-${level}`}>
                          <input aria-labelledby={`traitify-career-level-${level}-label`} checked={currentExperienceLevels.includes(level)} className={style.check} id={`traitify-career-level-${level}`} name="experience_level" type="checkbox" onChange={this.onExperienceChange} value={level} />
                          <Icon icon={currentExperienceLevels.includes(level) ? faCheckSquare : faSquare} />
                          <span id={`traitify-career-level-${level}-label`}>{translate(`experience_level_${level}`)}</span>
                        </label>
                      </li>
                    ))}
                  </div>
                  <div>
                    <li>
                      <input type="submit" value={translate("search")} />
                    </li>
                  </div>
                </ul>
              </div>
            </li>
            <div ref={(customContent)=>{ this.customContent = customContent; }} />
          </ul>
        </form>
      </div>
    );
  }
}

export {CareerFilter as Component};
export default withTraitify(CareerFilter);
