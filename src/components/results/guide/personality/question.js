import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useState} from "react";
import Icon from "components/common/icon";
import Markdown from "components/common/markdown";
import style from "./style.scss";

function parseQuestionText(text) {
  if(!text) return {introduction: "", numberWithLabel: "", text: ""};

  try {
    const [introduction, ...content] = text.split("\n\n\n");
    const [numberWithLabel, ...remainingText] = content.join("\n\n\n").split(":");
    const questionText = remainingText.join(":").trim();

    return {introduction, numberWithLabel, text: questionText};
  } catch(error) {
    console.error("Error parsing question text:", {text, error}); // eslint-disable-line no-console
    return {introduction: "", numberWithLabel: "", text: ""};
  }
}

function Question({question}) {
  const [showContent, setShowContent] = useState(false);
  const parsedText = parseQuestionText(question.text);
  const introduction = question.introduction || parsedText.introduction;
  const number = question.numberWithLabel || parsedText.numberWithLabel;
  const text = question.questionText || parsedText.text;

  return (
    <>
      <div className={style.p}>{introduction}</div>
      <div className={[style.question, showContent && style.open].filter(Boolean).join(" ")}>
        <button onClick={() => setShowContent(!showContent)} type="button">
          <div className={style.number}>{number}</div>
          <div className={style.divider} />
          <div className={style.prompt}>
            <div className={style.text}>{text}</div>
            <Icon className={style.arrow} icon={showContent ? faChevronUp : faChevronDown} />
          </div>
        </button>
        {showContent && (
          <div className={style.questionContent}>
            <div className={style.list}>
              <Markdown>{question.purpose}</Markdown>
            </div>
            {question.adaptability && (
              <div className={style.list}>
                <Markdown>{question.adaptability}</Markdown>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

Question.propTypes = {
  question: PropTypes.shape({
    adaptability: PropTypes.string,
    introduction: PropTypes.string,
    numberWithLabel: PropTypes.string,
    order: PropTypes.number.isRequired,
    purpose: PropTypes.string.isRequired,
    questionText: PropTypes.string,
    text: PropTypes.string
  }).isRequired
};

export default Question;
