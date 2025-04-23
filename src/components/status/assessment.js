import {faCheck} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import Icon from "components/common/icon";
import get from "lib/common/object/get";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import {activeState} from "lib/recoil";
import style from "./style.scss";

// TODO: Extract text to translate
const translations = {
  complete: "Complete",
  loading: "Loading", // Already translated
  status: {
    start: "Start Assessment"
  },
  survey: {
    cognitive_assessment: "Cognitive Assessment",
    external_assessment: "External Assessment",
    personality_assessment: "Personality Assessment"
  }
};

function Button({assessment}) {
  const listener = useListener();
  const options = useOption("status") || {};
  const redirect = get(options, "allowRedirect", true);
  const setActive = useSetRecoilState(activeState);

  if(assessment.completed) {
    return <button disabled={true} type="button">{translations.complete}</button>;
  }

  if(assessment.skipped) {
    return <button disabled={true} type="button">Skipped</button>;
  }

  if(assessment.link && redirect) {
    return <a href={assessment.link}>{translations.status.start}</a>;
  }

  if(assessment.loading) {
    return <button disabled={true} type="button">{translations.loading}</button>;
  }

  const start = () => {
    listener.trigger("Survey.start", {assessment});
    setActive({...assessment});
  };

  return <button onClick={start} type="button">{translations.status.start}</button>;
}

Button.propTypes = {
  assessment: PropTypes.shape({
    completed: PropTypes.bool,
    link: PropTypes.string,
    loading: PropTypes.bool,
    skipped: PropTypes.bool
  }).isRequired
};

function Assessment({assessment}) {
  const surveyName = assessment.surveyName || translations.survey[`${assessment.surveyType}_assessment`];

  return (
    <div className={[style.assessment, assessment.completed && style.inactive].filter(Boolean).join(" ")}>
      <div>
        {assessment.completed && <Icon className={style.icon} icon={faCheck} />}
        <span className={style.text}>{surveyName}</span>
      </div>
      <Button assessment={assessment} />
    </div>
  );
}

Assessment.propTypes = {
  assessment: PropTypes.shape({
    completed: PropTypes.bool,
    skipped: PropTypes.bool,
    surveyName: PropTypes.string,
    surveyType: PropTypes.string.isRequired
  }).isRequired
};

export default Assessment;
