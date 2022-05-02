/* eslint-disable react/no-unused-class-component-methods */
import {
  faCheckSquare,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component} from "react";
import {careerOption} from "lib/helpers";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class CareerFilter extends Component {
  static defaultProps = {options: null};
  static propTypes = {
    isReady: PropTypes.func.isRequired,
    options: PropTypes.shape({
      careerOptions: PropTypes.shape({
        experienceLevels: PropTypes.arrayOf(
          PropTypes.number.isRequired
        )
      })
    }),
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired,
    setElement: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      params: {},
      showFilters: false
    };
  }
  componentDidMount() {
    this.props.ui.trigger("CareerFilter.initialized", this);
    this.props.ui.on("Careers.mergeParams", this.mergeParams);
    this.props.ui.on("Careers.updateParams", this.updateParams);
  }
  componentDidUpdate() {
    this.props.ui.trigger("CareerFilter.updated", this);
  }
  componentWillUnmount() {
    this.props.ui.off("Careers.mergeParams", this.mergeParams);
    this.props.ui.off("Careers.updateParams", this.updateParams);
  }
  mergeParams = () => {
    this.setState((state, props) => ({
      params: {
        ...state.params,
        ...props.ui.current["Careers.mergeParams"]
      }
    }));
  };
  toggleFilters = () => {
    this.setState((state) => ({showFilters: !state.showFilters}));
  };
  updateParams = () => {
    this.setState({
      params: {...this.props.ui.current["Careers.updateParams"]}
    });
  };
  onChange = (e) => {
    const {name, value} = e.target;

    this.setState((state) => {
      const params = {...state.params};

      params[name] = value;

      return {params};
    });
  };
  onExperienceChange = (e) => {
    const value = +e.target.value;
    const defaultLevels = careerOption(this.props, "experienceLevels") || [1, 2, 3, 4, 5];

    this.setState((state) => {
      const params = {...state.params};
      let levels = params.experience_levels;
      levels = levels ? levels.split(",").map((level) => (+level)) : defaultLevels;

      if(levels.includes(value)) {
        levels = levels.filter((l) => (l !== value));
        if(levels.length === 0) { levels = defaultLevels; }
      } else {
        levels.push(value);
      }

      params.experience_levels = levels.sort().join(",");

      return {params};
    });
  };
  onSubmit = (e) => {
    e.preventDefault();

    this.props.ui.trigger("Careers.mergeParams", this, {
      ...this.state.params,
      page: 1
    });

    return false;
  };
  render() {
    if(!this.props.isReady("results")) { return null; }

    const {params, showFilters} = this.state;
    const {translate, setElement} = this.props;
    const experienceLevels = careerOption(this.props, "experienceLevels") || [1, 2, 3, 4, 5];
    const currentExperienceLevels = params.experience_levels || experienceLevels;
    const currentSort = params.sort || "match";
    const currentSearch = params.search || "";

    return (
      <div className={style.container} ref={setElement}>
        <form onSubmit={this.onSubmit}>
          <ul>
            <li className={style.search}>
              <label className={style.label} htmlFor="traitify-career-search">{translate("search")}</label>
              <input className={style.field} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={this.onChange} />
            </li>
            <li className={style.searchLocation}>
              <label className={style.label} htmlFor="traitify-career-search">{translate("location")}</label>
              <input className={style.field} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("location")} type="text" onChange={this.onChange} />
            </li>
            <li>
              <label className={style.filterLabel} htmlFor="traitify-career-search">{translate("filter")}</label>
              <div className={style.fieldGroup}>
                <button onClick={this.toggleFilters} type="button">{translate("filter")}</button>
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
                    {experienceLevels.map((level) => {
                      const checked = currentExperienceLevels.includes(level);

                      return (
                        <li key={level}>
                          <label htmlFor={`traitify-career-level-${level}`}>
                            <input aria-labelledby={`traitify-career-level-${level}-label`} checked={checked} className={style.check} id={`traitify-career-level-${level}`} name="experience_level" type="checkbox" onChange={this.onExperienceChange} value={level} />
                            <Icon icon={checked ? faCheckSquare : faSquare} />
                            <span id={`traitify-career-level-${level}-label`}>
                              {translate(`experience_level_${level}`)}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </div>
                  <div>
                    <li className={style.center}>
                      <input type="submit" value={translate("search")} />
                    </li>
                  </div>
                </ul>
              </div>
            </li>
            <div ref={(customContent) => { this.customContent = customContent; }} />
          </ul>
        </form>
      </div>
    );
  }
}

export {CareerFilter as Component};
export default withTraitify(CareerFilter);
