import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useState} from "react";
import Icon from "components/common/icon";
import Markdown from "components/common/markdown";
import style from "./style.scss";

function Question({question}) {
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      <div className={style.p}>{question.introduction}</div>
      <div className={[style.question, showContent && style.open].filter(Boolean).join(" ")}>
        <button onClick={() => setShowContent(!showContent)} type="button">
          <div className={style.number}>{question.numberWithLabel}</div>
          <div className={style.divider} />
          <div className={style.prompt}>
            <div className={style.text}>{question.questionText}</div>
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
