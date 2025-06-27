import PropTypes from "prop-types";
import {useState} from "react";
import style from "./style.scss";

export default function Responses({responseOptions = [], updateAnswer}) {
  const buttonClass = ["traitify--response-button", style.response].join(" ");
  const buttonWidth = (text) => (text.length > 20 ? "100%" : "auto");
  const [activeButton, setActiveButton] = useState(null);
  const selectOption = (optionId) => {
    setActiveButton(optionId);
    updateAnswer(optionId);
  };

  return (
    <div>
      {responseOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${buttonClass} ${activeButton === option.id ? style.btnActive : ""}`}
          onClick={() => selectOption(option.id)}
          style={{width: `${buttonWidth(option.text)}`}}
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
