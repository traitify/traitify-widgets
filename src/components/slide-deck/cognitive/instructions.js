/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import {useWindowSize} from "lib/helpers/hooks";
import Practice from "./practice";
import {videoProps} from "./helpers";
import style from "./style.scss";

const urlBase = "https://cdn.traitify.com/images/cognitive";

function Instructions({captureLearningDisability, onStart, translate}) {
  const [width] = useWindowSize();
  const [disability, setDisability] = useState(false);
  const [step, setStep] = useState(1);
  const [type, setType] = useState(width > 768 ? "h" : "v");

  useEffect(() => { setType(width > 768 ? "h" : "v"); }, [width]);

  if(step === 1) {
    return (
      <div key={`step-1-${type}`} className={style.instructions}>
        <h1>{translate("cognitive_instructions_step_1_heading")}</h1>
        <p>{translate("cognitive_instructions_step_1_text")}</p>
        <button className={style.btnBlue} onClick={() => setStep(2)} type="button">{translate("cognitive_instructions_step_1_button")}</button>
      </div>
    );
  }

  if(step === 2) {
    const video = `${urlBase}/practice-example-${type}.mp4`;

    return (
      <div key={`step-2-${type}`} className={style.instructions}>
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
      <DangerousHTML html={translate("cognitive_instructions_step_4_html")} />
      {captureLearningDisability && (
        <label htmlFor="traitify-disability">
          {translate("cognitive_instructions_disability_text")}
          <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
        </label>
      )}
      <button className={style.btnBlue} onClick={() => onStart({disability})} type="button">{translate("cognitive_instructions_step_4_button")}</button>
    </div>
  );
}

Instructions.defaultProps = {captureLearningDisability: false};
Instructions.propTypes = {
  captureLearningDisability: PropTypes.bool,
  onStart: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default Instructions;
