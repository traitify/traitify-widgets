import PropTypes from "prop-types";
import {useState} from "react";
import style from "./style.scss";

export default function Responses({responseOptions = [], updateAnswer}) {
  const buttonClass = ["traitify--response-button", style.response].join(" ");
  const longTextResponses = responseOptions.some((option) => option.text.length > 20);
  const buttonWidth = longTextResponses ? "100%" : "auto";
  const optionsDirection = longTextResponses ? "column" : "row";
  const [activeButton, setActiveButton] = useState(null);
  const selectOption = (optionId) => {
    setActiveButton(optionId);
    updateAnswer(optionId);
  };

  return (
    <div
      className={style.responseOptions}
      style={{flexDirection: optionsDirection}}
    >
      {responseOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${buttonClass} ${activeButton === option.id ? style.btnActive : ""}`}
          onClick={() => selectOption(option.id)}
          style={{width: buttonWidth}}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}

Responses.propTypes = {
  responseOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  updateAnswer: PropTypes.func.isRequired
};
