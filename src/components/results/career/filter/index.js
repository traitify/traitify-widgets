import {faCheckSquare, faSquare} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import Icon from "components/common/icon";
import useComponentEvents from "lib/hooks/use-component-events";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import {careersParamsState} from "lib/recoil";
import style from "./style.scss";

export default function CareerFilter() {
  const [filters, setFilters] = useState({});
  const [params, setParams] = useRecoilState(careersParamsState);
  const [showFilters, setShowFilters] = useState(false);
  const [submit, setSubmit] = useState(0);
  const options = useOption("career") || {};
  const results = useResults();
  const translate = useTranslate();

  useComponentEvents("CareerFilter");
  useEffect(() => { setFilters({...params}); }, [params]);
  useEffect(() => {
    if(submit === 0) { return; }

    setParams({...filters, page: 1});
  }, [submit]);

  if(!results) { return null; }

  const experienceLevels = options.experienceLevels || [1, 2, 3, 4, 5];
  const currentExperienceLevels = filters.experience_levels
    ? filters.experience_levels.split(",").map((level) => (+level))
    : [...experienceLevels];
  const onChange = (e) => {
    const {name, value} = e.target;

    setFilters({...filters, [name]: value});
  };
  const onExperienceChange = (e) => {
    const value = +e.target.value;
    let levels = [...currentExperienceLevels];

    if(levels.includes(value)) {
      levels = levels.filter((level) => (level !== value));
      if(levels.length === 0) { levels = [...experienceLevels]; }
    } else {
      levels.push(value);
    }

    setFilters({...filters, experience_levels: levels.sort().join(",")});
  };
  const onSubmit = (e) => {
    e?.preventDefault();

    setSubmit((index) => index + 1);
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
            <input className={style.searchFieldLG} value={filters.search || ""} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={onChange} />
            <input className={style.searchField} value={filters.search || ""} id="traitify-career-search" name="search" placeholder={translate("search")} type="text" onChange={liveSearch} />
          </div>
          <div className={style.location}>
            <label className={style.label} htmlFor="traitify-career-location">{translate("location")}</label>
            <input className={style.field} value={filters.location || ""} id="traitify-career-location" name="location" placeholder={translate("location")} type="text" onChange={onChange} />
          </div>
          <div className={style.filter}>
            <label className={style.label} htmlFor="traitify-career-filter">{translate("filter")}</label>
            <button className={style.filterButton} onClick={() => setShowFilters(!showFilters)} type="button">{translate("filter")}</button>
            <div className={`${style.filterContent} ${showFilters ? style.block : ""}`}>
              <div className={style.group}>
                <div>{translate("sort")}</div>
                <label className={style.check} htmlFor="traitify-career-sort-match">
                  <input
                    aria-labelledby="traitify-career-sort-match-label"
                    checked={filters.sort === "match"}
                    id="traitify-career-sort-match"
                    name="sort"
                    onChange={onChange}
                    type="radio"
                    value="match"
                  />
                  <Icon icon={filters.sort === "match" ? faCheckSquare : faSquare} />
                  <span id="traitify-career-sort-match-label">{translate("best_match")}</span>
                </label>
                <label className={style.check} htmlFor="traitify-career-sort-title">
                  <input
                    aria-labelledby="traitify-career-sort-title-label"
                    checked={filters.sort === "title"}
                    id="traitify-career-sort-title"
                    name="sort"
                    onChange={onChange}
                    type="radio"
                    value="title"
                  />
                  <Icon icon={filters.sort === "title" ? faCheckSquare : faSquare} />
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
