import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import "lib/crosschq/crosschq-widget.css";
import {render} from "lib/crosschq/crosschq-widget.es";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

function Crosschq({id = null}) {
  const disabled = useDisabledComponent("CrosschqResults");
  const element = useRef(null);
  const assessment = useResults({id, surveyType: "external"});

  useComponentEvents("CrosschqResults");
  useLayoutEffect(() => {
    if(!element.current) { return; }

    const widget = render({
      interviewID: assessment.externalId,
      target: element.current,
      reportData: assessment.results
    });

    return () => widget.destroy();
  }, [assessment, disabled]);

  if(disabled) { return null; }
  if(!assessment) { return null; }
  if(!assessment.results) { return null; }

  return (
    <section ref={element} className={style.container} />
  );
}

Crosschq.propTypes = {id: PropTypes.string};

export default Crosschq;
