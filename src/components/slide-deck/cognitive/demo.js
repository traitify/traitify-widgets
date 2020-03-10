import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import Slide from "./slide";
import {useSlidesLoader} from "./helpers";

const defaultSlides = [
  {
    id: "s-1",
    questionImage: {url: "https://via.placeholder.com/300?text=Test+Question+1"},
    responses: [
      {id: "r-1", image: {url: "https://via.placeholder.com/100/008000?text=Response+A"}},
      {id: "r-2", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+B"}},
      {id: "r-3", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+C"}},
      {id: "r-4", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+D"}}
    ]
  },
  {
    id: "s-2",
    questionImage: {url: "https://via.placeholder.com/300?text=Test+Question+2"},
    responses: [
      {id: "r-5", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+A"}},
      {id: "r-6", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+B"}},
      {id: "r-7", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+C"}},
      {id: "r-8", image: {url: "https://via.placeholder.com/100/008000?text=Response+D"}}
    ]
  },
  {
    id: "s-3",
    questionImage: {url: "https://via.placeholder.com/300?text=Test+Question+3"},
    responses: [
      {id: "r-9", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+A"}},
      {id: "r-10", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+B"}},
      {id: "r-11", image: {url: "https://via.placeholder.com/100/008000?text=Response+C"}},
      {id: "r-12", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+D"}}
    ]
  },
  {
    id: "s-4",
    questionImage: {url: "https://via.placeholder.com/300?text=Test+Question+4"},
    responses: [
      {id: "r-13", image: {url: "https://via.placeholder.com/100/FF0000?text=Response+A"}},
      {id: "r-14", image: {url: "https://via.placeholder.com/100/008000?text=Response+B"}},
      {id: "r-15", image: {url: "https://via.placeholder.com/100/0000FF?text=Response+C"}},
      {id: "r-16", image: {url: "https://via.placeholder.com/100/FFFF00?text=Response+D"}}
    ]
  }
];

function Demo(props) {
  const [initialSlides, setInitialSlides] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const {dispatch, error, slides} = useSlidesLoader(initialSlides);
  const onSelect = (answer) => {
    dispatch({answer, slideIndex, type: "response"});
    setSlideIndex(slideIndex + 1);
  };

  useEffect(() => {
    // TODO: Get from API
    setInitialSlides(defaultSlides);
  }, []);

  useEffect(() => {
    if(slides.length === 0) { return; }
    if(slides.length !== slideIndex) { return; }

    props.onFinish();
  }, [slideIndex]);

  const slide = slides[slideIndex];

  if(!slide) { return <Loading />; }

  // TODO: Display error?
  // TODO: Retry?
  if(error) { console.log(error); }

  return (
    <div>
      <Slide onSelect={onSelect} slide={slides[slideIndex]} />
    </div>
  );
}

Demo.propTypes = {
  onFinish: PropTypes.func.isRequired
};

export default Demo;
