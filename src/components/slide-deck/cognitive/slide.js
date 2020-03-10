import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";

function Slide({onSelect, slide}) {
  const [answer, setAnswer] = useState(null);
  const onConfirm = () => onSelect(answer);
  const onSkip = () => onSelect(null);

  useEffect(() => setAnswer(null), [slide.id]);

  if(!slide.loaded) { return <Loading />; }

  return (
    <div>
      <img alt="Question" src={slide.questionImage.url} />
      {slide.responses.map(({id, image}) => (
        <button key={id} onClick={() => setAnswer(id)} type="button">
          <img alt="Response" src={image.url} />
        </button>
      ))}
      <button onClick={onSkip} type="button">Skip</button>
      <button disabled={!answer} onClick={answer && onConfirm} type="button">Confirm</button>
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
