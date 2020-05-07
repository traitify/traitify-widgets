/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useState} from "react";
import Practice from "./practice";
import {videoProps} from "./helpers";
import style from "./style.scss";

function Instructions({onStart, translate}) {
  const [disability, setDisability] = useState(false);
  const [step, setStep] = useState(1);

  if(step === 1) {
    const video = "https://cdn.traitify.com/images/cognitive/instructions-1.mp4";

    return (
      <div key="step-1" className={style.instructions}>
        <h1>{translate("cognitive_instructions_step_1_heading")}</h1>
        <p>{translate("cognitive_instructions_step_1_text")}</p>
        <video {...videoProps}><source src={video} type="video/mp4" /></video>
        <button className={style.btnBlue} onClick={() => setStep(2)} type="button">{translate("cognitive_instructions_step_1_button")}</button>
      </div>
    );
  }

  if(step === 2) {
    const video = "https://cdn.traitify.com/images/cognitive/practice-example.mp4";

    return (
      <div key="step-2" className={style.instructions}>
        <h2>{translate("cognitive_instructions_step_2_heading")}</h2>
        <p>{translate("cognitive_instructions_step_2_text")}</p>
        <video {...videoProps}><source src={video} type="video/mp4" /></video>
        <button className={style.btnBlue} onClick={() => setStep(3)} type="button">{translate("cognitive_instructions_step_2_button")}</button>
      </div>
    );
  }

  if(step === 3) {
    return <Practice onFinish={() => setStep(4)} translate={translate} />;
  }

  return (
    <div key="step-4" className={style.instructions}>
      <h2>{translate("cognitive_instructions_step_4_heading")}</h2>
      <p>{translate("cognitive_instructions_step_4_text")}</p>
      <label htmlFor="traitify-disability">
        {translate("cognitive_instructions_disability_text")}
        <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
      </label>
      <button className={style.btnBlue} onClick={() => onStart({disability})} type="button">{translate("cognitive_instructions_step_4_button")}</button>
    </div>
  );
}

Instructions.propTypes = {
  onStart: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default Instructions;
