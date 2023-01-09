/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Markdown from "lib/helpers/markdown";
import {dig} from "lib/helpers/object";
import useWindowSize from "lib/hooks/use-window-size";
import {
  defaultExamples,
  defaultExplanations,
  defaultInstruction,
  defaultQuestions
} from "./instructions-defaults";
import Practice from "./practice";
import {videoProps} from "./helpers";
import style from "./style.scss";

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
  const finalInstruction = options.finalInstruction || defaultInstruction;
  const practiceExamples = options.practiceExamples || defaultExamples;
  const timeTrial = !!options.timeTrial;
  const minimal = dig(options, "timeTrial", "minimal") === true;
  const timed = dig(options, "timeTrial", "timed") === true;

  useEffect(() => { setType(width > 768 ? "h" : "v"); }, [width]);
  useEffect(() => { if(minimal) { setStep(practiceExamples.length + 2); } }, [minimal]);

  const example = practiceExamples[step - 1];
  const instructionOptions = {minimal, timeTrial, timed, translate, type};

  if(example) {
    const {button, heading, text, video} = typeof example === "function" ? example(instructionOptions) : example;

    return (
      <div key={`step-${step}-${type}`} className={style.instructions}>
        {step === 1 ? <h1>{heading}</h1> : <h2>{heading}</h2>}
        {text && <Markdown className={style.text}>{text}</Markdown>}
        {video && <video {...videoProps}><source src={video} type="video/mp4" /></video>}
        <button className={style.btnBlue} onClick={() => setStep(step + 1)} type="button">{button}</button>
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
    <div key={`step-${step}`} className={style.instructions}>
      <h2>{heading}</h2>
      {text && <Markdown className={style.text}>{text}</Markdown>}
      {video && <video {...videoProps}><source src={video} type="video/mp4" /></video>}
      {captureLearningDisability && (
        <label htmlFor="traitify-disability">
          {translate("cognitive_instructions_disability_text")}
          <input checked={disability} id="traitify-disability" name="disability" onChange={() => setDisability(!disability)} type="checkbox" />
        </label>
      )}
      <button className={style.btnBlue} onClick={() => onStart({disability})} type="button">{button}</button>
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
  translate: PropTypes.func.isRequired
};

export default Instructions;
