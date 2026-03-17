import PropTypes from "prop-types";
import style from "./style.scss";

function Question({index, question, updateAnswer}) {
  const wide = question.responseOptions.some((option) => option.text.length > 20);
  const buttonClass = ["traitify--response-button", style.choice].join(" ");

  return (
    <div className={style.question}>
      <div className={style.divider} />
      <div className={style.text}>{index + 1}. {question.text}</div>
      <div className={[style.choices, wide && style.wide].filter(Boolean).join(" ")}>
        {question.responseOptions.map((option) => (
          <button
            key={option.id}
            className={[buttonClass, question.answer?.id === option.id && style.active].filter(Boolean).join(" ")}
            onClick={() => updateAnswer(option)}
            type="button"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

Question.propTypes = {
  index: PropTypes.number.isRequired,
  question: PropTypes.shape({
    answer: PropTypes.shape({id: PropTypes.string.isRequired}),
    responseOptions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      })
    ).isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  updateAnswer: PropTypes.func.isRequired
};

export default Question;
