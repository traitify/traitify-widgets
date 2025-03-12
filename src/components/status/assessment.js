import {faCheck} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import Icon from "components/common/icon";
import get from "lib/common/object/get";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import {activeState} from "lib/recoil";
import style from "./style.scss";

function Button({assessment}) {
  const listener = useListener();
  const options = useOption("status") || {};
  const redirect = get(options, "allowRedirect", true);
  const setActive = useSetRecoilState(activeState);

  if(assessment.completed) {
    return <button disabled={true} type="button">Complete</button>;
  }

  if(assessment.skipped) {
    return <button disabled={true} type="button">Skipped</button>;
  }

  if(assessment.link && redirect) {
    return <a href={assessment.link}>Start Assessment</a>;
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
    skipped: PropTypes.bool.isRequired
  }).isRequired
};

function Assessment({assessment}) {
  return (
    <div className={[style.assessment, (assessment.completed || assessment.skipped) && style.inactive].filter(Boolean).join(" ")}>
      <div>
        {(assessment.completed || assessment.skipped) && (
          <Icon className={style.icon} icon={faCheck} />
        )}
        <span className={style.text}>{assessment.name}</span>
      </div>
      <Button assessment={assessment} />
    </div>
  );
}

Assessment.propTypes = {
  assessment: PropTypes.shape({
    completed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    skipped: PropTypes.bool.isRequired
  }).isRequired
};

export default Assessment;
