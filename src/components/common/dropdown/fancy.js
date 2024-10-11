import {faAngleUp, faAngleDown, faCheck, faSearch} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useState} from "react";
import Icon from "components/common/icon";
import style from "./style.scss";

function FancyDropdown({
  className: _className = null,
  currentText,
  id,
  name: _name,
  onChange,
  options,
  searchText,
  value: _value = null
}) {
  const className = [_className, style.container].filter(Boolean).join(" ");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onClick = (e) => {
      const container = document.querySelector(`.${style.container}`);
      if(!container) { return; }
      if(!container.contains(e.target)) { setShow(false); }
    };

    document.addEventListener("click", onClick, true);

    return () => { document.removeEventListener("click", onClick); };
  }, []);

  useLayoutEffect(() => {
    if(!show) { return; }

    document.querySelector(`.${style.search} input`).focus();
  }, [show]);

  const currentOption = options.find(({value}) => value === _value);
  const filteredOptions = options.filter(({name, value}) => {
    if(!search) { return true; }
    if(name.toLowerCase().includes(search.toLowerCase())) { return true; }
    if(value.toLowerCase().includes(search.toLowerCase())) { return true; }

    return false;
  }).sort((a, b) => a.name.localeCompare(b.name));
  const onKeyDown = (e) => {
    if(e.key === "Enter" || e.code === "Space") {
      e.preventDefault();
      e.currentTarget.click();
    }
    if(e.key === "ArrowDown") {
      e.preventDefault();
      e.currentTarget.nextSibling
        ? e.currentTarget.nextSibling.focus()
        : document.querySelector(`.${style.options}`).firstChild.focus();
    }
    if(e.key === "ArrowUp") {
      e.preventDefault();
      e.currentTarget.previousSibling
        ? e.currentTarget.previousSibling.focus()
        : document.querySelector(`.${style.options}`).lastChild.focus();
    }
  };
  const onSearchKeyDown = (e) => {
    if(e.key === "ArrowDown") {
      e.preventDefault();
      document.querySelector(`.${style.options}`).firstChild.focus();
    }
    if(e.key === "ArrowUp") {
      e.preventDefault();
      document.querySelector(`.${style.options}`).lastChild.focus();
    }
  };
  const onSelect = (value) => {
    onChange({target: {name: _name, value}});
    setShow(false);
    setSearch("");
  };

  return (
    <label className={className} htmlFor={id}>
      <button className={style.current} onClick={() => setShow(!show)} type="button">
        {currentOption ? (
          <div>
            <span className={style.collapse}>{currentOption.name}</span>
            <span className={style.stiff}> ({currentText})</span>
          </div>
        ) : searchText}
        <Icon icon={show ? faAngleDown : faAngleUp} />
      </button>
      {show && (
        <div className={style.dropdown}>
          <div className={style.search}>
            <Icon alt={searchText} icon={faSearch} />
            <input
              autoComplete="off"
              id={id}
              name="search"
              placeholder={searchText}
              type="text"
              onChange={({target: {value}}) => setSearch(value)}
              onKeyDown={onSearchKeyDown}
              value={search}
            />
          </div>
          <div className={style.options}>
            {filteredOptions.includes(currentOption) && (
              <button onKeyDown={onKeyDown} onClick={() => onSelect(currentOption.value)} tabIndex={0} type="button">
                {currentOption.name} ({currentText})
                <Icon icon={faCheck} />
              </button>
            )}
            {filteredOptions.filter((option) => option !== currentOption).map(({name, value}) => (
              <button key={value} onKeyDown={onKeyDown} onClick={() => onSelect(value)} tabIndex={0} type="button">
                {name}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <button onKeyDown={onKeyDown} onClick={() => {}} tabIndex={0} type="button">
                {searchText}
              </button>
            )}
          </div>
        </div>
      )}
    </label>
  );
}

FancyDropdown.propTypes = {
  className: PropTypes.string,
  currentText: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  searchText: PropTypes.string.isRequired,
  value: PropTypes.string
};

export default FancyDropdown;
