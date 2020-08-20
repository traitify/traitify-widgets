/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import {useWindowSize} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import Practice from "./practice";
import {videoProps} from "./helpers";
import style from "./style.scss";

const urlBase = "https://cdn.traitify.com/images/cognitive";

function Instructions({
  captureLearningDisability,
  initialLearningDisability,
  onStart,
  options,
  translate
}) {
  const [width] = useWindowSize();
  const [disability, setDisability] = useState(initialLearningDisability || false);
  const [step, setStep] = useState(1);
  const [type, setType] = useState(width > 768 ? "h" : "v");
  const timeTrial = !!options.timeTrial;
  const minimal = dig(options, ["timeTrial", "minimal"]) === true;
  const timed = dig(options, ["timeTrial", "timed"]) === true;

  useEffect(() => { setType(width > 768 ? "h" : "v"); }, [width]);
  useEffect(() => { if(minimal) { setStep(4); } }, [minimal]);

  if(step === 1) {
    return (
      <div key={`step-1-${type}`} className={style.instructions}>
        <h1>{translate("cognitive_instructions_step_1_heading")}</h1>
        {timeTrial ? (
          <p>{translate(`cognitive_instructions_trial_step_1_text`)}</p>
        ) : (
          <p>{translate("cognitive_instructions_step_1_text")}</p>
        )}
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
      {timeTrial ? (
        <DangerousHTML html={translate(`cognitive_instructions_trial_step_4_${timed ? "timed" : "untimed"}${minimal ? "_minimal" : ""}_html`)} />
      ) : (
        <DangerousHTML html={translate("cognitive_instructions_step_4_html")} />
      )}
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

Instructions.defaultProps = {
  captureLearningDisability: false,
  initialLearningDisability: false,
  options: {}
};
Instructions.propTypes = {
  captureLearningDisability: PropTypes.bool,
  initialLearningDisability: PropTypes.bool,
  onStart: PropTypes.func.isRequired,
  options: PropTypes.shape({
    timeTrial: PropTypes.shape({
      minimal: PropTypes.bool,
      timed: PropTypes.bool
    })
  }),
  translate: PropTypes.func.isRequired
};

export default Instructions;
