import {faClock} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import Icon from "lib/helpers/icon";
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
  const disableTimeLimit = props.getOption("disableTimeLimit");
  const [initialSlides, setInitialSlides] = useState([]);
  const {dispatch, error, slides} = useSlidesLoader(initialSlides);
  const [disability, setDisability] = useState(false);
  const [onlySkipped, setOnlySkipped] = useState(false);
  const [slideIndex, setSlideIndex] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const onSelect = (answer) => {
    dispatch({answer, slideIndex, type: "response"});
    if(!onlySkipped) { return setSlideIndex(slideIndex + 1); }

    const newSlideIndex = slides.findIndex((slide, index) => index > slideIndex && !slide.answer);
    setSlideIndex(newSlideIndex === -1 ? slides.length + 1 : newSlideIndex);
  };
  const onStart = (options) => {
    if(options.disability) { setDisability(true); }

    setSlideIndex(0);
    setStartTime(Date.now());
  };
  const onSubmit = () => {
    if(submitting) { return; }

    setSubmitting(true);
    setTimeLeft(0);
    console.log("Submitting");
    // TODO: Ajax
  };

  useEffect(() => {
    if(!props.assessment) { return; }

    // TODO: Reset everything if slides change? or id changes? locale?
    // setInitialSlides(props.assessment.slides);
    setInitialSlides(defaultSlides);
  }, [props.assessment && props.assessment.slides]);

  useEffect(() => {
    if(disableTimeLimit) { return; }

    const calculateTimeLeft = () => {
      const allowedTime = 1000 * (disability ? 385 : 300);
      const timePassed = Date.now() - startTime;

      return (allowedTime - timePassed) / 1000;
    };

    if(!startTime) { return; }
    if(!timeLeft) { setTimeLeft(calculateTimeLeft()); }

    setTimeout(() => {
      if(submitting) { return; }

      const newTimeLeft = calculateTimeLeft();

      if(newTimeLeft > 0) {
        setTimeLeft(newTimeLeft);
      } else {
        onSubmit();
      }
    }, 1000);
  }, [startTime, timeLeft]);

  const slide = slides[slideIndex];

  useEffect(() => {
    if(slides.length === 0) { return; }
    if(slides.length !== slideIndex) { return; }
    if(onlySkipped) { return onSubmit(); }

    setOnlySkipped(true);
    const newSlideIndex = slides.findIndex(({answer}) => !answer);
    if(newSlideIndex === -1) { return onSubmit(); }

    setSlideIndex(newSlideIndex);
  }, [slides, slideIndex]);

  if(slideIndex === null) { return <Instructions onStart={onStart} />; }
  if(!slide) { return <Loading />; }

  // TODO: Display error?
  // TODO: Retry?
  if(error) { console.log(error); }

  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <div className={style.mainStatus}>
      {!disableTimeLimit && (
        <div className={style.statusContainer}>
          <div className={style.timer}>
            <Icon icon={faClock} />
            &nbsp; {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className={style.status}>{slideIndex + 1} / {slides.length}</div>
          <div className={style.progressBar}>
            <div className={style.progress} />
          </div>
        </div>
      )}
      <Slide onSelect={onSelect} slide={slide} />
    </div>
  );
}

Cognitive.defaultProps = {assessment: null};
Cognitive.propTypes = {
  assessment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slides: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  getOption: PropTypes.func.isRequired
};

export {Cognitive as Component};
export default withTraitify(Cognitive);
