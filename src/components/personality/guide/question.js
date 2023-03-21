import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useState} from "react";
import Markdown from "components/common/markdown";
import Icon from "components/common/icon";
import style from "./style.scss";

function Question({question}) {
  const [showContent, setShowContent] = useState(false);
  const [introduction, ...content] = question.text.split("\n\n\n");
  const [number, ...remainingText] = content.join("\n\n\n").split(":");
  const text = remainingText.join(":").trim();

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
    order: PropTypes.number.isRequired,
    purpose: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};

export default Question;
