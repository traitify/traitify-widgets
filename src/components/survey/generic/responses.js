import PropTypes from "prop-types";
import style from "./style.scss";

export default function Responses({responseOptions = []}) {
  const buttonClass = ["traitify--response-button", style.response].join(" ");
  const buttonWidth = (text) => {
    console.log("Calculating button width for text:", text.length);
    return text.length > 20 ? "100%" : "auto";
  };

  return (
    <div>
      {responseOptions.map((option) => (
        <button key={option.id} type="button" className={buttonClass} style={{width: `${buttonWidth(option.text)}`}}>
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
  ).isRequired
};
