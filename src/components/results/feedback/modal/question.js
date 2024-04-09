import PropTypes from "prop-types";
import {useState, useEffect} from "react";
import style from "./style.scss";

function MultipleChoice({onChange, questionId, questionText, options}) {
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    onChange({
      question_type: "Multiple Choice",
      question_id: questionId,
      selected_option_id: answer
    });
  }, [answer]);
  return (
    <div className={style.questionSection}>
      <label className={style.question} htmlFor={questionId}>{questionText}</label>
      <select
        id={questionId}
        name={questionId}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      >
        <option disabled={true} hidden={true} value="">Select</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.text}</option>
        ))}
      </select>
    </div>
  );
}
MultipleChoice.propTypes = {
  onChange: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  questionText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired
};

function ShortResponse({onChange, questionId, questionText}) {
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    onChange({
      question_type: "Short Response",
      question_id: questionId,
      short_response: answer
    });
  }, [answer]);

  return (
    <div className={style.questionSection}>
      <label className={style.question} htmlFor={questionId}>{questionText}</label>
      <textarea name={questionId} rows="5" value={answer} onChange={(e) => setAnswer(e.target.value)} />
    </div>
  );
}
ShortResponse.propTypes = {
  onChange: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  questionText: PropTypes.string.isRequired
};

export default function Question({onChange, question}) {
  switch(question.questionType) {
    case "Multiple Choice":
      return (
        <MultipleChoice
          onChange={onChange}
          questionId={question.id}
          questionText={question.text}
          options={question.multipleChoiceOptions}
        />
      );
    case "Short Response":
      return (
        <ShortResponse
          onChange={onChange}
          questionId={question.id}
          questionText={question.text}
        />
      );
    default:
      console.error(`Unknown question type: ${question.questionType}`); /* eslint-disable-line no-console */
      throw new Error("Unknown question type");
  }
}
Question.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    questionType: PropTypes.oneOf(["Multiple Choice", "Short Response"]).isRequired,
    text: PropTypes.string.isRequired,
    multipleChoiceOptions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }))
  }).isRequired
};
