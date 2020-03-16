import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import style from "./style.scss";

function Slide({onSelect, slide}) {
  const [answer, setAnswer] = useState(null);
  const onConfirm = () => onSelect(answer);
  const onSkip = () => onSelect(null);

  useEffect(() => setAnswer(null), [slide.id]);

  if(!slide.loaded) { return <Loading />; }

  return (
    <div>
      <div className={style.question}>
        <img alt="Question" src={slide.questionImage.url} />
      </div>
      <div className={style.choices}>
        <div className={style.choicesContainer}>
          {slide.responses.map(({id, image}) => (
            <button key={id} onClick={() => setAnswer(id)} type="button">
              <img alt="Response" src={image.url} />
            </button>
          ))}
        </div>
      </div>
      <div className={style.buttons}>
        <button onClick={onSkip} className={style.btnSkip} type="button">Skip</button>
        <button disabled={!answer} className={style.btnConfirm} onClick={answer && onConfirm} type="button">Confirm</button>
      </div>
    </div>
  );
}

Slide.propTypes = {
  onSelect: PropTypes.func.isRequired,
  slide: PropTypes.shape({
    id: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    questionImage: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired,
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        image: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired
      })
    )
  }).isRequired
};

export default Slide;
