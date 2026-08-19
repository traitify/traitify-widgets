import {render} from "@crosschq/interview-report-widget";
import "@crosschq/interview-report-widget/style.css";
import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

function Crosschq({id = null}) {
  const disabled = useDisabledComponent("CrosschqResults");
  const element = useRef(null);
  const assessment = useResults({id, surveyType: "external"});
  const results = assessment?.results;

  useComponentEvents("CrosschqResults");
  useLayoutEffect(() => {
    if(!element.current) { return; }

    const widget = render({
      fraudData: results.fraud_data,
      interviewID: assessment.externalId,
      reportData: results.report_data,
      target: element.current,
      transcriptionData: results.transcript_data
    });

    return () => widget.destroy();
  }, [assessment, disabled, results]);

  if(disabled) { return null; }
  if(!assessment) { return null; }
  if(!results) { return null; }

  return (
    <section ref={element} className={style.container} />
  );
}

Crosschq.propTypes = {id: PropTypes.string};

export default Crosschq;
