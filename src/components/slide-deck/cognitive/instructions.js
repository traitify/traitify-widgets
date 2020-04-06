import PropTypes from "prop-types";
import {useState} from "react";
import Practice from "./practice";
import style from "./style.scss";

function Instructions(props) {
  const [disability, setDisability] = useState(false);
  const [step, setStep] = useState(1);

  if(step === 1) {
    const image = "https://cdn.traitify.com/images/cognitive/instructions-1.mp4";
    const text = [
      "This assessment is about your ability to work out patterns and relationships between shapes.",
      `On each screen you will see a grid with different shapes in it. One shape is missing, as indicated by "?".`
    ];

    return (
      <div className={style.instructions}>
        <h1>Assessment Instructions</h1>
        <p>{text}</p>
        <video autoPlay={true} loop={true} muted={true}><source src={image} type="video/mp4" /></video>
        <button className={style.btnBlue} onClick={() => setStep(2)} type="button">Next</button>
      </div>
    );
  }

  if(step === 2) {
    const disabilityText = "Please select if you have a learning disability.";
    const image = "https://cdn.traitify.com/images/cognitive/instructions-2.mp4";
    const text = [
      "Work out how the shapes in the grid are related to each other. Then pick which of the four shapes below the grid completes it.",
      `Once you've made your selection, please click on "Confirm" to advance.`,
      "Click below to see an example"
    ].join("\n\n");

    return (
      <div className={style.instructions}>
        <video autoPlay={true} loop={true} muted={true}><source src={image} type="video/mp4" /></video>
        <p>{text}</p>
        <label htmlFor="traitify-disability">
          <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
          {disabilityText}
        </label>
        <button className={style.btnBlue} onClick={() => setStep(3)} type="button">See Example</button>
      </div>
    );
  }

  if(step === 3) {
    const heading = "Here's an example";
    const image = "https://cdn.traitify.com/images/cognitive/practice-example.mp4";
    const text = "In this guide there is a triangle, pentagon and arrow in each row and column. There is one black, one blue and one white shape and the shapes are all in the same orientation. The shape that completes the grid is therefore the bottom left shape.";

    return (
      <div className={style.instructions}>
        <h2>{heading}</h2>
        <video autoPlay={true} loop={true} muted={true}><source src={image} type="video/mp4" /></video>
        <p>{text}</p>
        <button className={style.btnBlue} onClick={() => setStep(4)} type="button">Start Practice</button>
      </div>
    );
  }

  if(step === 4) {
    return <Practice onFinish={() => setStep(5)} />;
  }

  const heading = "Get Ready For the Real Assessment";
  const text = [
    "The assessment is untimed but most people complete it within 30 minutes.",
    "You should find a quiet place where you can give the assessment your full attention without being distracted.",
    "You can skip questions if you need to but try to give an answer to each question.",
    "Please complete the assessment in a single sitting."
  ].join("\n\n");

  return (
    <div className={style.container}>
      <h2>{heading}</h2>
      <h3>Before you start...</h3>
      <p>{text}</p>
      <button className={style.btnBlue} onClick={() => props.onStart({disability})} type="button">Start Assessment</button>
    </div>
  );
}

Instructions.propTypes = {
  onStart: PropTypes.func.isRequired
};

export default Instructions;
