import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import withTraitify from "lib/with-traitify";
import Instructions from "./instructions";
import Slide from "./slide";
import {useSlidesLoader} from "./helpers";
import style from "./style.scss";

const defaultSlides = [
  {
    id: "s-1",
    questionImage: {url: "https://via.placeholder.com/300?text=Question+1"},
    responses: [
      {id: "r-1", image: {url: "https://via.placeholder.com/100/008000?text=Response+A"}},
      {id: "r-2", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+B"}},
      {id: "r-3", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+C"}},
      {id: "r-4", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+D"}}
    ]
  },
  {
    id: "s-2",
    questionImage: {url: "https://via.placeholder.com/300?text=Question+2"},
    responses: [
      {id: "r-5", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+A"}},
      {id: "r-6", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+B"}},
      {id: "r-7", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+C"}},
      {id: "r-8", image: {url: "https://via.placeholder.com/100/008000?text=Response+D"}}
    ]
  },
  {
    id: "s-3",
    questionImage: {url: "https://via.placeholder.com/300?text=Question+3"},
    responses: [
      {id: "r-9", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+A"}},
      {id: "r-10", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+B"}},
      {id: "r-11", image: {url: "https://via.placeholder.com/100/008000?text=Response+C"}},
      {id: "r-12", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+D"}}
    ]
  },
  {
    id: "s-4",
    questionImage: {url: "https://via.placeholder.com/300?text=Question+4"},
    responses: [
      {id: "r-13", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+A"}},
      {id: "r-14", image: {url: "https://via.placeholder.com/100/008000?text=Response+B"}},
      {id: "r-15", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+C"}},
      {id: "r-16", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+D"}}
    ]
  }
];

function Cognitive(props) {
  const [initialSlides, setInitialSlides] = useState([]);
  const {dispatch, error, slides} = useSlidesLoader(initialSlides);
  const [disability, setDisability] = useState(false);
  const [slideIndex, setSlideIndex] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const onSelect = (answer) => {
    dispatch({answer, slideIndex, type: "response"});
    setSlideIndex(slideIndex + 1);
  };
  const onStart = (options) => {
    if(options.disability) { setDisability(true); }

    setSlideIndex(0);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if(!props.assessment) { return; }

    // TODO: Reset everything if slides change? or id changes? locale?
    // setInitialSlides(props.assessment.slides);
    setInitialSlides(defaultSlides);
  }, [props.assessment && props.assessment.slides]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const allowedTime = 60 * 1000 * (disability ? 6.5 : 5.0);
      const timePassed = Date.now() - startTime;

      return (allowedTime - timePassed) / 1000;
    };

    if(!startTime) { return; }
    if(!timeLeft) { setTimeLeft(calculateTimeLeft()); }

    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  }, [startTime, timeLeft]);

  const slide = slides[slideIndex];

  useEffect(() => {
    if(slides.length === 0) { return; }
    if(slides.length !== slideIndex) { return; }

    // TODO: Submit
    console.log("Submitting");
  }, [slides, slideIndex]);

  if(slideIndex === null) { return <Instructions onStart={onStart} />; }
  if(!slide) { return <div>Loading Sign + Send me to results</div>; }

  // TODO: Display error?
  // TODO: Retry?
  if(error) { console.log(error); }

  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <div className={style.mainStatus}>
      <div className={style.statusContainer}>
        <div className={style.timer}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
        <div className={style.status}>{slideIndex + 1} / {slides.length}</div>
        <div className={style.progressBar}>
          <div className={style.progress} />
        </div>
      </div>
      <Slide onSelect={onSelect} slide={slide} />
    </div>
  );
}

Cognitive.defaultProps = {assessment: null};
Cognitive.propTypes = {
  assessment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slides: PropTypes.arrayOf(PropTypes.object).isRequired
  })
};

export {Cognitive as Component};
export default withTraitify(Cognitive);
