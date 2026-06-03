import {faCheck} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import Icon from "components/common/icon";
import get from "lib/common/object/get";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {activeState} from "lib/recoil";
import style from "./style.scss";
import useStatusTranslate from "./use-status-translate";

function Button({assessment}) {
  const interview = assessment.vendor === "crosschq";
  const listener = useListener();
  const options = useOption("status") || {};
  const redirect = get(options, "allowRedirect", !interview);
  const setActive = useSetRecoilState(activeState);
  const statusTranslate = useStatusTranslate({assessment});
  const translate = useTranslate();

  if(assessment.completed) {
    return <button disabled={true} type="button">{translate("complete")}</button>;
  }

  if(assessment.skipped) {
    return <button disabled={true} type="button">{translate("skipped")}</button>;
  }

  const start = () => {
    listener.trigger("Survey.start", {assessment});
    setActive({...assessment});
  };

  if(assessment.link) {
    const props = redirect ? {} : {target: "_blank"};

    return <a href={assessment.link} onClick={start} {...props}>{statusTranslate("start")}</a>;
  }

  if(assessment.loading) {
    return <button disabled={true} type="button">{translate("loading")}</button>;
  }

  return <button onClick={start} type="button">{statusTranslate("start")}</button>;
}

Button.propTypes = {
  assessment: PropTypes.shape({
    completed: PropTypes.bool,
    link: PropTypes.string,
    loading: PropTypes.bool,
    skipped: PropTypes.bool,
    vendor: PropTypes.string
  }).isRequired
};

function Assessment({assessment}) {
  const statusTranslate = useStatusTranslate({assessment});
  const translate = useTranslate();
  const surveyName = statusTranslate("survey")
    || assessment.surveyName
    || translate(`survey.${assessment.surveyType}_assessment`);

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
