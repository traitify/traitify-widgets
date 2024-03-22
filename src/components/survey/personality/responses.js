import PropTypes from "prop-types";
import camelCase from "lib/common/string/camel-case";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Responses({likert, onResponse}) {
  const translate = useTranslate();

  const buttonClass = [
    "traitify--response-button",
    style.response,
    !onResponse && style.btnDisabled
  ].filter(Boolean).join(" ");
  const buttons = likert ? [
    {key: "really_not_me", response: "REALLY_NOT_ME"},
    {key: "not_me", response: "NOT_ME"},
    {key: "me", response: "ME"},
    {key: "really_me", response: "REALLY_ME"}
  ] : [
    {key: "me", response: true},
    {key: "not_me", response: false}
  ];

  return (
    <div className={style.buttons}>
      {buttons.map(({key, response}) => (
        <button
          key={key}
          className={[buttonClass, style[camelCase(key)]].join(" ")}
          onClick={onResponse && (() => onResponse(response))}
          type="button"
        >
          {translate(key)}
        </button>
      ))}
    </div>
  );
}

Responses.defaultProps = {likert: false, onResponse: null};
Responses.propTypes = {likert: PropTypes.bool, onResponse: PropTypes.func};

export default Responses;
