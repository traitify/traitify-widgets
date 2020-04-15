import PropTypes from "prop-types";
import {useState} from "react";
import Practice from "./practice";
import style from "./style.scss";

function Instructions({onStart, translate}) {
  const [disability, setDisability] = useState(false);
  const [step, setStep] = useState(1);

  if(step === 1) {
    const image = "https://cdn.traitify.com/images/cognitive/instructions-1.mp4";

    return (
      <div className={style.instructions}>
        <h1>{translate("cognitive_instructions_step_1_heading")}</h1>
        <p>{translate("cognitive_instructions_step_1_text")}</p>
        <video autoPlay={true} loop={true} playsinline={true} muted={true}><source src={image} type="video/mp4" /></video>
        <button className={style.btnBlue} onClick={() => setStep(2)} type="button">{translate("cognitive_instructions_step_1_button")}</button>
      </div>
    );
  }

  if(step === 2) {
    const image = "https://cdn.traitify.com/images/cognitive/instructions-2.mp4";

    return (
      <div className={style.instructions}>
        <p>{translate("cognitive_instructions_step_2_text")}</p>
        <video autoPlay={true} loop={true} playsinline={true} muted={true}><source src={image} type="video/mp4" /></video>
        <label htmlFor="traitify-disability">
          <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
          {translate("cognitive_instructions_disability_text")}
        </label>
        <br /><br />
        <button className={style.btnBlue} onClick={() => setStep(3)} type="button">{translate("cognitive_instructions_step_2_button")}</button>
      </div>
    );
  }

  if(step === 3) {
    const image = "https://cdn.traitify.com/images/cognitive/practice-example.mp4";

    return (
      <div className={style.instructions}>
        <h2>{translate("cognitive_instructions_step_3_heading")}</h2>
        <video autoPlay={true} loop={true} playsinline={true} muted={true}><source src={image} type="video/mp4" /></video>
        <p>{translate("cognitive_instructions_step_3_text")}</p>
        <button className={style.btnBlue} onClick={() => setStep(4)} type="button">{translate("cognitive_instructions_step_3_button")}</button>
      </div>
    );
  }

  if(step === 4) {
    return <Practice onFinish={() => setStep(5)} translate={translate} />;
  }

  return (
    <div className={style.container}>
      <h2>{translate("cognitive_instructions_step_5_heading")}</h2>
      <h3>{translate("cognitive_instructions_step_5_subheading")}</h3>
      <p>{translate("cognitive_instructions_step_5_text")}</p>
      <button className={style.btnBlue} onClick={() => onStart({disability})} type="button">{translate("cognitive_instructions_step_5_button")}</button>
    </div>
  );
}

Instructions.propTypes = {
  onStart: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default Instructions;
