/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Markdown from "components/common/markdown";
import dig from "lib/common/object/dig";
import useSetting from "lib/hooks/use-setting";
import useWindowSize from "lib/hooks/use-window-size";
import {videoProps} from "./helpers";
import {
  defaultExamples,
  defaultExplanations,
  defaultInstruction,
  defaultQuestions
} from "./instructions-defaults";
import Practice from "./practice";
import style from "./style.scss";

function Instructions({
  captureLearningDisability = false,
  initialLearningDisability = false,
  onStart,
  options = {},
  surveyID,
  translate
}) {
  const allowSkip = useSetting("skipAssessmentAccommodation", {fallback: false});
  const [width] = useWindowSize();
  const [disability, setDisability] = useState(initialLearningDisability || false);
  const [step, setStep] = useState(1);
  const [showAccommodation, setShowAccommodation] = useState(false);
  const [type, setType] = useState(width > 768 ? "h" : "v");
  const finalInstruction = options.finalInstruction || defaultInstruction;
  const practiceExamples = options.practiceExamples || defaultExamples;
  const timeTrial = !!options.timeTrial;
  const minimal = dig(options, "timeTrial", "minimal") === true;
  const timed = dig(options, "timeTrial", "timed") === true;

  useEffect(() => { setType(width > 768 ? "h" : "v"); }, [width]);
  useEffect(() => { if(minimal) { setStep(practiceExamples.length + 2); } }, [minimal]);

  // TODO: Request Accommodation
  const example = practiceExamples[step - 1];
  const instructionOptions = {id: surveyID, minimal, timeTrial, timed, translate, type};
  const onRequest = () => {};

  if(showAccommodation) {
    return (
      <div key="request-accommodation" className={style.container}>
        <h1>{translate("survey.accommodation.request")}</h1>
        <div className={style.text}>{translate("survey.accommodation.request_text")}</div>
        <div className={style.btnGroup}>
          <button className={style.btnBack} onClick={() => setShowAccommodation(false)} type="button">
            {translate("back")}
          </button>
          <button className={style.btnBlue} onClick={onRequest} type="button">
            {translate("survey.accommodation.confirm")}
          </button>
        </div>
      </div>
    );
  }

  if(example) {
    const {button, heading, text, video} = typeof example === "function" ? example(instructionOptions) : example;

    return (
      <div key={`step-${step}-${type}`} className={style.container}>
        {step === 1 ? <h1>{heading}</h1> : <h2>{heading}</h2>}
        {text && <Markdown className={style.text}>{text}</Markdown>}
        {video && <video {...videoProps}><source src={video} type="video/mp4" /></video>}
        <div className={style.btnGroup}>
          {step === 1 && allowSkip && (
            <button className={style.btnBack} onClick={() => setShowAccommodation(true)} type="button">{translate("survey.accommodation.request")}</button>
          )}
          <button className={`traitify--response-button ${style.btnBlue}`} onClick={() => setStep(step + 1)} type="button">{button}</button>
        </div>
      </div>
    );
  }

  if(step === practiceExamples.length + 1) {
    return (
      <Practice
        onFinish={() => setStep(step + 1)}
        practiceExplanations={options.practiceExplanations || defaultExplanations}
        practiceQuestions={options.practiceQuestions || defaultQuestions}
        translate={translate}
      />
    );
  }

  const {button, heading, text, video} = typeof finalInstruction === "function" ? finalInstruction(instructionOptions) : finalInstruction;

  return (
    <div key={`step-${step}`} className={style.container}>
      <h2>{heading}</h2>
      {text && <Markdown className={style.text}>{text}</Markdown>}
      {video && <video {...videoProps}><source src={video} type="video/mp4" /></video>}
      {captureLearningDisability && (
        <label htmlFor="traitify-disability">
          {translate("cognitive_instructions_disability_text")}
          <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
        </label>
      )}
      <button className={`traitify--response-button ${style.btnBlue}`} onClick={() => onStart({disability})} type="button">{button}</button>
    </div>
  );
}

Instructions.propTypes = {
  captureLearningDisability: PropTypes.bool,
  initialLearningDisability: PropTypes.bool,
  onStart: PropTypes.func.isRequired,
  options: PropTypes.shape({
    finalInstruction: PropTypes.oneOfType([
      PropTypes.func.isRequired,
      PropTypes.shape({
        button: PropTypes.string.isRequired,
        heading: PropTypes.string.isRequired,
        text: PropTypes.string,
        video: PropTypes.string
      }).isRequired
    ]),
    practiceExamples: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.func.isRequired,
        PropTypes.shape({
          button: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired
        }).isRequired
      ]).isRequired
    ),
    practiceExplanations: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.func.isRequired,
        PropTypes.shape({
          button: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          text: PropTypes.string,
          video: PropTypes.string
        }).isRequired
      ]).isRequired
    ),
    practiceQuestions: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.func.isRequired,
        PropTypes.shape({
          correctAnswerID: PropTypes.string.isRequired,
          questionImage: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired,
          responses: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              image: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired
            }).isRequired
          ).isRequired
        }).isRequired
      ])
    ),
    timeTrial: PropTypes.shape({
      minimal: PropTypes.bool,
      timed: PropTypes.bool
    })
  }),
  surveyID: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired
};

export default Instructions;
