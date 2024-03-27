import {
  faChevronLeft,
  faMaximize,
  faMinimize
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useRef} from "react";
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
  caption,
  children,
  dispatch,
  likert,
  onResponse,
  progress,
  slideIndex
}) {
  const assessment = useAssessment({type: "personality"});
  const {allowBack, allowFullscreen} = useOption("survey") || {};
  const container = useRef(null);
  const content = useRef(null);
  const [fullscreen, toggleFullscreen] = useFullscreen(container.current);
  const size = useElementSize(content.current);
  const text = useRef(null);
  const translate = useTranslate();

  useEffect(() => { dispatch({size, type: "resize"}); }, [...size]);
  useLayoutEffect(() => {
    if(!text.current) { return; }

    text.current.focus({preventScroll: true});
  }, [caption]);

  const back = () => dispatch({type: "back"});
  const textSurvey = dig(assessment, "slide_type") === "text";

  return (
    <div className={style.container} ref={container}>
      {caption && !textSurvey && (
        <div className={style.caption} ref={text} tabIndex="-1">{caption}</div>
      )}
      <div className={style.content} ref={content}>
        <div className={style.progress} style={{width: `${progress}%`}} />
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
    </div>
  );
}

Container.defaultProps = {caption: null, likert: false, onResponse: null};
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
