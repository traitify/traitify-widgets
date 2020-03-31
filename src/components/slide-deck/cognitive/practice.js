import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import Slide from "./slide";
import {useQuestionsLoader} from "./helpers";
import practiceQuestions from "./practice-questions";
import style from "./style.scss";

function Practice(props) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const {dispatch, error, questions} = useQuestionsLoader(practiceQuestions);
  const onNext = () => setQuestionIndex(questionIndex + 1);
  const onSelect = (answer) => {
    dispatch({answer, questionIndex, type: "response"});
  };

  useEffect(() => {
    if(questions.length === 0) { return; }
    if(questions.length !== questionIndex) { return; }

    props.onFinish();
  }, [questionIndex]);

  const question = questions[questionIndex];

  if(!question) { return <Loading />; }
  if(question.answer !== undefined) {
    if(questionIndex === 0) {
      const image = "https://cdn.traitify.com/images/cognitive/practice-1.mp4";
      const text = "In this grid, the top shape in the first row is rotated 180 degrees and shown in the corresponding cell below. The shape that completes this grid is therefore the bottom right shape.";

      return (
        <div className={style.instructions}>
          <h1>Answer Explanation</h1>
          <p>{text}</p>
          <video autoPlay={true} loop={true} muted={true}><source src={image} type="video/mp4" /></video>
          <button className={style.btnBlue} onClick={onNext} type="button">Next Question</button>
        </div>
      );
    }

    if(questionIndex === 1) {
      const image = "https://cdn.traitify.com/images/cognitive/practice-2.mp4";
      const text = "In this grid, the number of lines shown for each shape increases by one along each row and down each column. Lines are added in a clockwise direction. The shape that completes this grid is therefore the top left shape.";

      return (
        <div className={style.instructions}>
          <h1>Answer Explanation</h1>
          <p>{text}</p>
          <video autoPlay={true} loop={true} muted={true}><source src={image} type="video/mp4" /></video>
          <button className={style.btnBlue} onClick={onNext} type="button">Next Question</button>
        </div>
      );
    }

    if(questionIndex === 2) {
      const image = "https://cdn.traitify.com/images/cognitive/practice-3.mp4";
      const text = "In the column on the right, the middle shape is made up of a larger version of the top shape with the bottom shape inside it. The shading of the top and bottom shapes is reversed in the middle shape. The shape that completes the grid is therefore the top right shape.";

      return (
        <div className={style.instructions}>
          <h1>Answer Explanation</h1>
          <video autoPlay={true} loop={true} muted={true}><source src={image} type="video/mp4" /></video>
          <p>{text}</p>
          <button className={style.btnBlue} onClick={onNext} type="button">Next</button>
        </div>
      );
    }
  }

  // TODO: Display error?
  // TODO: Retry?
  if(error) { console.log(error); }

  const progress = 100.0 * (questionIndex + 1) / questions.length;

  return (
    <div>
      <div className={style.statusContainer}>
        <div>Example Questions</div>
        <div className={style.status}>{questionIndex + 1} / {questions.length}</div>
        <div className={style.progressBar}>
          <div className={style.progress} style={{width: `${progress}%`}} />
        </div>
      </div>
      <Slide onSelect={onSelect} question={questions[questionIndex]} />
    </div>
  );
}

Practice.propTypes = {
  onFinish: PropTypes.func.isRequired
};

export default Practice;
