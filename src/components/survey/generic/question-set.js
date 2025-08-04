import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Responses from "./responses";
import style from "./style.scss";

export default function QuestionSet({next, questionSet, updateAnswer}) {
  const questionSetClass = [style.questionSet].join(" ");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const setFinished = questionSet.questions.length === selectedOptions.length;
  const selectOption = (questionId, optionId) => {
    if(!selectedOptions.includes(questionId)) setSelectedOptions([...selectedOptions, questionId]);
    updateAnswer(questionId, optionId);
  };

  useEffect(() => {
    if(!setFinished) return;
    next();
  }, [setFinished]);

  return (
    <div className={questionSetClass}>
      <img src={questionSet.setImage} alt={questionSet.text} />
      {questionSet.questions.map((question, index) => (
        <div key={question.id}>
          <div className={style.grayDivider} />
          <div className={style.question}>{index + 1}. {question.text}</div>
          <Responses
            responseOptions={question.responseOptions}
            updateAnswer={(optionId) => selectOption(question.id, optionId)}
          />
        </div>
      ))}
    </div>
  );
}

QuestionSet.propTypes = {
  next: PropTypes.func.isRequired,
  questionSet: PropTypes.shape({
    text: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })).isRequired,
    setImage: PropTypes.string.isRequired
  }).isRequired,
  updateAnswer: PropTypes.func.isRequired
};
