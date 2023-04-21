import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useState} from "react";
import Markdown from "components/common/markdown";
import Icon from "components/common/icon";
import style from "./style.scss";

function Sequence({index, sequence}) {
  const [showContent, setShowContent] = useState(index === 0);

  return (
    <div className={[style.sequence, showContent && style.open].filter(Boolean).join(" ")}>
      <button onClick={() => setShowContent(!showContent)} type="button">
        <div className={style.prompt}>
          <div className={style.text}>{sequence.title}</div>
          <Icon className={style.arrow} icon={showContent ? faChevronUp : faChevronDown} />
        </div>
      </button>
      {showContent && (
        <div className={style.sequenceContent}>
          {sequence.introduction && <Markdown>{sequence.introduction}</Markdown>}
          <ul>
            {sequence.questions.map(({id, text}) => <li key={id}>{text}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

Sequence.propTypes = {
  index: PropTypes.number.isRequired,
  sequence: PropTypes.shape({
    introduction: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
};

export default Sequence;
