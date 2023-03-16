import {faCheckSquare, faSquare} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Icon from "components/common/icon";
import useComponentEvents from "lib/hooks/use-component-events";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function CareerFilter() {
  const [params, setParams] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const options = useOption("career") || {};
  const results = useResults();
  const translate = useTranslate();

  useComponentEvents("CareerFilter");

  // TODO: Listen to careersParamsState
  // TODO: Update careersParamsState

  const onSubmit = (e) => {
    e?.preventDefault();

    // ui.trigger("Careers.mergeParams", {props}, {...params, page: 1});
  };

  if(!results) { return null; }

  const experienceLevels = options.experienceLevels || [1, 2, 3, 4, 5];
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
    const defaultLevels = options.experienceLevels || [1, 2, 3, 4, 5];

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

  const liveSearch = (e) => {
    onChange(e);
    onSubmit();
  };

  return (
    <div className={style.container}>
      <form onSubmit={onSubmit}>
        <div className={style.row}>
          <div className={style.search}>
            <label className={style.label} htmlFor="traitify-career-search">{translate("search")}</label>
            <input className={style.searchFieldLG} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={onChange} />
            <input className={style.searchField} value={currentSearch} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={liveSearch} />
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
                <div>{translate("education_level")}</div>
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
      </form>
    </div>
  );
}
