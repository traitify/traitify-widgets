import {
  faChevronLeft,
  faMaximize,
  faMinimize
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import Icon from "components/common/icon";
import dig from "lib/common/object/dig";
import useAssessment from "lib/hooks/use-assessment";
import useElementSize from "lib/hooks/use-element-size";
import useFullscreen from "lib/hooks/use-fullscreen";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import Responses from "./responses";
import style from "./style.scss";

function Container({
  caption = null,
  children,
  dispatch,
  likert = false,
  onResponse = null,
  progress,
  slideIndex
}) {
  const assessment = useAssessment({surveyType: "personality"});
  const {allowFullscreen, ...options} = useOption("survey") || {};
  const container = useRef(null);
  const content = useRef(null);
  const [fullscreen, toggleFullscreen] = useFullscreen(container.current);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const size = useElementSize(content.current);
  const text = useRef(null);
  const translate = useTranslate();

  useEffect(() => { dispatch({size, type: "resize"}); }, [...size]);
  useLayoutEffect(() => {
    if(!text.current) { return; }

    text.current.focus({preventScroll: true});
  }, [caption]);

  const back = () => dispatch({type: "back"});
  const showHelp = Object.hasOwn(options, "showHelp") ? options.showHelp : false;
  const textSurvey = dig(assessment, "slide_type")?.toLowerCase() === "text";
  const allowBack = Object.hasOwn(options, "allowBack") ? options.allowBack : textSurvey;

  return (
    <div className={`${style.container} traitify--survey-${textSurvey ? "text" : "image"}`} ref={container}>
      {caption && !textSurvey && (
        <div className={style.caption} ref={text} tabIndex="-1">
          <span className={style.spacer} />
          <span>{caption}</span>
          {showHelp && <HelpButton onClick={() => setShowHelpModal(true)} />}
        </div>
      )}
      {textSurvey && (
        <div className={style.progressBar}>
          <div className={style.progress} style={{width: `${progress}%`}} />
        </div>
      )}
      <div className={style.content} ref={content}>
        {!textSurvey && <div className={style.progress} style={{width: `${progress}%`}} />}
        {children}
        {allowBack && slideIndex > 0 && (
          <button className={style.back} onClick={back} type="button">
            <Icon alt={translate("back")} icon={faChevronLeft} />
          </button>
        )}
        {allowFullscreen && (
          <button className={style.fullscreen} onClick={toggleFullscreen} type="button">
            <Icon alt="fullscreen" icon={fullscreen ? faMinimize : faMaximize} />
          </button>
        )}
      </div>
      <Responses likert={likert} onResponse={onResponse} />
      {showHelpModal && <HelpModal show={showHelpModal} setShow={setShowHelpModal} />}
    </div>
  );
}

Container.propTypes = {
  caption: PropTypes.string,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  likert: PropTypes.bool,
  onResponse: PropTypes.func,
  progress: PropTypes.number.isRequired,
  slideIndex: PropTypes.number.isRequired
};

export default Container;
