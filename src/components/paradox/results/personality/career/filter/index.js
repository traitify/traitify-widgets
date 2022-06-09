import {
  faCheckSquare,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import {careerOption} from "lib/helpers";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function CareerFilter(props) {
  const {isReady, translate, setElement, ui} = props;
  const [params, setParams] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const customContent = useRef();
  const state = {};

  useDidMount(() => { ui.trigger("CareerFilter.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("CareerFilter.updated", {props, state}); });
  useEffect(() => {
    const mergeParams = () => setParams({...params, ...ui.current["Careers.mergeParams"]});
    const updateParams = () => setParams({...ui.current["Careers.updateParams"]});

    ui.on("Careers.mergeParams", mergeParams);
    ui.on("Careers.updateParams", updateParams);

    return () => {
      ui.off("Careers.mergeParams", mergeParams);
      ui.off("Careers.updateParams", updateParams);
    };
  }, []);

  if(!isReady("results")) { return null; }

  const experienceLevels = careerOption(props, "experienceLevels") || [1, 2, 3, 4, 5];
  const currentExperienceLevels = params.experience_levels || experienceLevels;
  const currentSort = params.sort || "match";
  const currentSearch = params.search || "";
  const currentLocation = params.location || "";
  const toggleFilters = () => setShowFilters(!showFilters);
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
  };

  return (
    <div className={style.container} ref={setElement}>
      <form onSubmit={onSubmit}>
        <div className={style.row}>
          <div className={style.search}>
            <label className={style.label} htmlFor="traitify-career-search">{translate("search")}</label>
            <input className={style.field} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={onChange} />
          </div>
          <div className={style.location}>
            <label className={style.label} htmlFor="traitify-career-location">{translate("location")}</label>
            <input className={style.field} value={currentLocation} id="traitify-career-location" name="location" placeholder={translate("location")} type="text" onChange={onChange} />
          </div>
          <div className={style.filter}>
            <label className={style.label} htmlFor="traitify-career-filter">{translate("filter")}</label>
            <button className={style.filterButton} onClick={toggleFilters} type="button">{translate("filter")}</button>
            <div className={`${style.filterContent} ${showFilters ? style.block : ""}`}>
              <div className={style.group}>
                <div>{translate("sort")}</div>
                <label className={style.check} htmlFor="traitify-career-sort-match">
                  <input
                    aria-labelledby="traitify-career-sort-match-label"
                    checked={currentSort === "match"}
                    id="traitify-career-sort-match"
                    name="sort"
                    onChange={onChange}
                    type="radio"
                    value="match"
                  />
                  <Icon icon={currentSort === "match" ? faCheckSquare : faSquare} />
                  <span id="traitify-career-sort-match-label">{translate("best_match")}</span>
                </label>
                <label className={style.check} htmlFor="traitify-career-sort-title">
                  <input
                    aria-labelledby="traitify-career-sort-title-label"
                    checked={currentSort === "title"}
                    id="traitify-career-sort-title"
                    name="sort"
                    onChange={onChange}
                    type="radio"
                    value="title"
                  />
                  <Icon icon={currentSort === "title" ? faCheckSquare : faSquare} />
                  <span id="traitify-career-sort-title-label">{translate("title")}</span>
                </label>
              </div>
              <div className={style.group}>
                <div>{translate("experience_level")}</div>
                {experienceLevels.map((level) => {
                  const checked = currentExperienceLevels.includes(level);
                  const id = `traitify-career-level-${level}`;

                  return (
                    <label key={level} className={style.check} htmlFor={id}>
                      <input
                        aria-labelledby={`${id}-label`}
                        checked={checked}
                        id={id}
                        name="experience_level"
                        onChange={onExperienceChange}
                        type="checkbox"
                        value={level}
                      />
                      <Icon icon={checked ? faCheckSquare : faSquare} />
                      <span id={`${id}-label`}>{translate(`experience_level_${level}`)}</span>
                    </label>
                  );
                })}
              </div>
              <div className={style.center}>
                <button type="submit">{translate("search")}</button>
              </div>
            </div>
          </div>
        </div>
        <div ref={customContent} />
      </form>
    </div>
  );
}

CareerFilter.defaultProps = {options: null};
CareerFilter.propTypes = {
  isReady: PropTypes.func.isRequired,
  options: PropTypes.shape({
    careerOptions: PropTypes.shape({
      experienceLevels: PropTypes.arrayOf(
        PropTypes.number.isRequired
      )
    })
  }),
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {CareerFilter as Component};
export default withTraitify(CareerFilter);
