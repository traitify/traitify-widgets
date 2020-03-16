import PropTypes from "prop-types";
import {useState} from "react";
import Demo from "./demo";
import style from "./style.scss";

function Instructions(props) {
  const [demo, setDemo] = useState(false);
  const [disability, setDisability] = useState(false);

  if(demo) { return <Demo onFinish={() => props.onStart({disability})} />; }

  // TODO: Either text get from API or translate
  return (
    <div className={style.instructions}>
      <h1>Cognitive Assessment</h1>
      <p>{"This assessment is about your ability to work out patterns and relationships between shapes. On each screen you will see a grid with different shapes in it. One shape is missing, as indicated by \"?\"."}</p>
      <p>
        Work out how the shapes in the grid are related to each other.
        Then, pick which of the four shapes below the grid completes it.
      </p>
      <p>{"Once you've made your selection, please click on \"Confirm\" to advance."}</p>
      <label htmlFor="traitify-disability">
        <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
        Please select if you have a learning disability.
      </label>
      <p className="center">Find a time and place where you will not be interrupted during the test. Then click below to start the assessment process</p>
      <button className={style.btnBlue} onClick={() => setDemo(true)} type="button">See Example</button>
    </div>
  );
}

Instructions.propTypes = {
  onStart: PropTypes.func.isRequired
};

export default Instructions;
