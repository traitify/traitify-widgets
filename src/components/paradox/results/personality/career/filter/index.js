/* eslint-disable react/no-unused-class-component-methods */
import {
  faCheckSquare,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import {careerOption} from "lib/helpers";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function CareerFilter(props) {
  const [params, setParams] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const {isReady, translate, setElement, ui} = props;
  const experienceLevels = careerOption(props, "experienceLevels") || [1, 2, 3, 4, 5];
  const currentExperienceLevels = params.experience_levels || experienceLevels;
  const currentSort = params.sort || "match";
  const currentSearch = params.search || "";
  const currentLocation = params.location || "";

  const customContent = useRef();

  const mergeParams = () => {
    setParams({
      ...params,
      ...ui.current["Careers.mergeParams"]
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateParams = () => {
    setParams({
      ...ui.current["Careers.updateParams"]
    });
  };

  const onChange = (e) => {
    const {name, value} = e.target;
    const newParams = {...params};
    newParams[name] = value;

    setParams(newParams);
  };

  const onExperienceChange = (e) => {
    const value = +e.target.value;
    const defaultLevels = careerOption(props, "experienceLevels") || [1, 2, 3, 4, 5];

    const newParams = {...params};
    let levels = newParams.experience_levels;
    levels = levels ? levels.split(",").map((level) => (+level)) : defaultLevels;

    if(levels.includes(value)) {
      levels = levels.filter((l) => (l !== value));
      if(levels.length === 0) { levels = defaultLevels; }
    } else {
      levels.push(value);
    }

    newParams.experience_levels = levels.sort().join(",");

    setParams(newParams);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    ui.trigger("Careers.mergeParams", {props}, {
      ...params,
      page: 1
    });

    return false;
  };

  useEffect(() => {
    ui.trigger("CareerFilter.initialized", {props});
    ui.on("Careers.mergeParams", mergeParams);
    ui.on("Careers.updateParams", updateParams);

    return () => {
      ui.off("Careers.mergeParams", mergeParams);
      ui.off("Careers.updateParams", updateParams);
    };
  }, []);

  useEffect(() => {
    ui.trigger("CareerFilter.updated", {props});
  });

  return (
    isReady("results") && (
      <div className={style.container} ref={setElement}>
        <form onSubmit={onSubmit}>
          <ul>
            <li className={style.search}>
              <label className={style.label} htmlFor="traitify-career-search">{translate("search")}</label>
              <input className={style.field} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={onChange} />
            </li>
            <li className={style.searchLocation}>
              <label className={style.label} htmlFor="traitify-career-search">{translate("location")}</label>
              <input className={style.field} value={currentLocation} id="traitify-career-search" name="location" placeholder={translate("location")} type="text" onChange={onChange} />
            </li>
            <li>
              <label className={style.filterLabel} htmlFor="traitify-career-search">{translate("filter")}</label>
              <div className={style.fieldGroup}>
                <button onClick={toggleFilters} type="button">{translate("filter")}</button>
                <ul className={`${style.formGroup} ${showFilters ? style.block : ""}`}>
                  <div>
                    <li className={style.groupTitle}>{translate("sort")}</li>
                    <li>
                      <label htmlFor="traitify-career-sort-match">
                        <input aria-labelledby="traitify-career-sort-match-label" checked={currentSort === "match"} className={style.check} id="traitify-career-sort-match" name="sort" type="radio" onChange={onChange} value="match" />
                        <Icon icon={currentSort === "match" ? faCheckSquare : faSquare} />
                        <span id="traitify-career-sort-match-label">{translate("best_match")}</span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="traitify-career-sort-title">
                        <input aria-labelledby="traitify-career-sort-title-label" checked={currentSort === "title"} className={style.check} id="traitify-career-sort-title" name="sort" type="radio" onChange={onChange} value="title" />
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
                            <input aria-labelledby={`traitify-career-level-${level}-label`} checked={checked} className={style.check} id={`traitify-career-level-${level}`} name="experience_level" type="checkbox" onChange={onExperienceChange} value={level} />
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
            <div ref={customContent} />
          </ul>
        </form>
      </div>
    )
  );
}
CareerFilter.propTypes = {
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
CareerFilter.defaultProps = {
  options: null
};
export {CareerFilter as Component};
export default withTraitify(CareerFilter);
