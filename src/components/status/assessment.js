import {faCheck} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import Icon from "components/common/icon";
import get from "lib/common/object/get";
import capitalize from "lib/common/string/capitalize";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import {activeState} from "lib/recoil";
import style from "./style.scss";

// TODO: Extract text to translate
function Button({assessment}) {
  const listener = useListener();
  const options = useOption("status") || {};
  const redirect = get(options, "allowRedirect", true);
  const setActive = useSetRecoilState(activeState);

  if(assessment.completed) {
    return <button disabled={true} type="button">Complete</button>;
  }

  if(assessment.link && redirect) {
    return <a href={assessment.link}>Start Assessment</a>;
  }

  if(assessment.loading) {
    return <button disabled={true} type="button">Loading</button>;
  }

  const start = () => {
    listener.trigger("Survey.start", {assessment});
    setActive({...assessment});
  };

  return <button onClick={start} type="button">Start Assessment</button>;
}

Button.propTypes = {
  assessment: PropTypes.shape({
    completed: PropTypes.bool.isRequired,
    link: PropTypes.string,
    loading: PropTypes.bool
  }).isRequired
};

function Assessment({assessment}) {
  const surveyName = assessment.surveyName || `${capitalize(assessment.surveyType)} Assessment`;

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
    completed: PropTypes.bool.isRequired,
    surveyName: PropTypes.string,
    surveyType: PropTypes.string.isRequired
  }).isRequired
};

export default Assessment;
