import PropTypes from "prop-types";
import {useLayoutEffect, useMemo, useRef} from "react";
import "lib/crosschq/crosschq-widget.css";
import {render} from "lib/crosschq/crosschq-widget.es";
// TODO: Remove after testing
import reportData from "lib/crosschq/sample-report.json";
import useAssessments from "lib/hooks/use-assessments";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import style from "./style.scss";

function Crosschq({id = null}) {
  const disabled = useDisabledComponent("CrosschqResults");
  const allAssessments = useAssessments() || [];
  const assessment = useMemo(() => {
    const assessments = allAssessments
      .filter(({completed}) => completed)
      .filter(({surveyType}) => surveyType === "external")
      .filter(({vendor}) => vendor === "crosschq");
    return id
      ? assessments.find(({id: aID}) => aID === id)
      : assessments[0];
  }, [allAssessments, id]);
  const element = useRef(null);

  useComponentEvents("CrosschqResults");
  useLayoutEffect(() => {
    if(!element.current) { return; }

    const widget = render({
      interviewID: assessment.externalID,
      target: element.current,
      reportData
    });

    return () => widget.destroy();
  }, [assessment, disabled]);

  if(disabled) { return null; }
  if(!assessment) { return null; }

  return (
    <section ref={element} className={style.container} />
  );
}

Crosschq.propTypes = {id: PropTypes.string};

export default Crosschq;
