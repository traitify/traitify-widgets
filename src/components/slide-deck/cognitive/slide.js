/* eslint-disable no-alert */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import style from "./style.scss";

function Slide({onSelect, question}) {
  const [answer, setAnswer] = useState(null);
  const onConfirm = () => onSelect(answer);
  const onSkip = () => window.confirm("Are you sure you want to skip?") && onSelect(null);

  useEffect(() => setAnswer(null), [question.id]);

  if(!question.loaded) { return <Loading />; }

  return (
    <div>
      <div className={style.question}>
        <img alt="Question" src={question.image.url} />
      </div>
      <div className={style.choices}>
        <div className={style.choicesContainer}>
          {question.responses.map(({id, image}) => (
            <button key={id} onClick={() => setAnswer(id)} type="button">
              <img alt="Response" className={answer === id ? style.selected : null} src={image.url} />
            </button>
          ))}
        </div>
      </div>
      <div className={style.buttons}>
        <button onClick={onSkip} className={style.btnSkip} type="button">Skip</button>
        <button disabled={!answer} className={style[answer ? "btnBlue" : "btnDisabled"]} onClick={answer && onConfirm} type="button">Confirm</button>
      </div>
    </div>
  );
}

Slide.propTypes = {
  onSelect: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired,
    loaded: PropTypes.bool,
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        image: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired
      })
    )
  }).isRequired
};

export default Slide;
