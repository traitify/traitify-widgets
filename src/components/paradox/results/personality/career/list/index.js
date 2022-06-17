import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {careerOption} from "lib/helpers";
import usePrevious from "lib/hooks/use-previous";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Career from "../details";
import HighlightedCareers from "../highlighted";
import style from "./style.scss";

function CareerList(props) {
  const [careers, setCareers] = useState([]);
  const [highlightedCareers, setHighlightedCareers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [moreCareers, setMoreCareers] = useState(false);

  const {assessmentID, locale, isReady, traitify, translate, ui, setElement} = props;

  const prevProps = {
    assessmentID: usePrevious(assessmentID),
    locale: usePrevious(locale)
  };

  const abortExistingRequest = () => {
    if(ui.current["Careers.fetching"]) {
      const previousRequest = ui.current["Careers.request"];
      previousRequest && previousRequest.xhr && previousRequest.xhr.abort();
    }
  };

  const fetch = () => {
    const fetchParams = ui.current["Careers.fetch"];

    if(!fetchParams) { return; }

    const path = careerOption(props, "path") || `/assessments/${assessmentID}/matches/careers`;
    const highlightedPath = careerOption(props, "highlightedPath");

    const params = {
      careers_per_page: careerOption(props, "perPage") || 20,
      locale_key: locale,
      paged: true,
      ...fetchParams
    };

    abortExistingRequest();
    ui.trigger("Careers.fetching", {props}, true);
    ui.trigger(
      "Careers.request",
      {props},
      traitify.get(path, params).then((response) => {
        const previousCareers = (params.page > 1) ? careers : [];

        setCareers(previousCareers.concat(response));
        setMoreCareers(response.length >= params.careers_per_page);
      })
    );

    highlightedPath && ui.trigger(
      "Careers.request",
      {props},
      traitify.get(highlightedPath, params).then((response) => {
        setHighlightedCareers(response);
      })
    );
  };

  const updateFetching = () => {
    setFetching(ui.current["Careers.fetching"]);
  };

  const mergeParams = () => {
    ui.trigger("Careers.fetch", {props}, {
      ...ui.current["Careers.fetch"],
      ...ui.current["Careers.mergeParams"]
    });
  };

  const showMore = () => {
    if(ui.current["Careers.fetching"]) { return; }
    const params = ui.current["Careers.fetch"] || {};
    const page = (params.page || 1) + 1;

    ui.trigger("Careers.mergeParams", {props}, {page});
  };

  const updateParams = () => {
    ui.trigger("Careers.fetch", {props}, {
      ...ui.current["Careers.updateParams"]
    });
  };

  useEffect(() => {
    ui.trigger("CareerResults.initialized", {props});
    ui.on("Careers.fetch", fetch);
    ui.on("Careers.fetching", updateFetching);
    ui.on("Careers.mergeParams", mergeParams);
    ui.on("Careers.updateParams", updateParams);

    if(isReady("results") && !ui.current["Careers.fetch"]) {
      ui.trigger("Careers.fetch", {props}, {});
    }

    return () => {
      ui.off("Careers.fetch", fetch);
      ui.off("Careers.fetching", updateFetching);
      ui.off("Careers.mergeParams", mergeParams);
      ui.off("Careers.updateParams", updateParams);

      abortExistingRequest();
      ui.trigger("Careers.fetching", {props}, false);
      ui.trigger("Careers.fetch", {props}, null);
    };
  }, []);

  useEffect(() => {
    ui.trigger("CareerResults.updated", {props});

    const assessmentChanged = assessmentID !== prevProps.assessmentID;
    const assessmentReady = isReady("results");
    const existingRequest = ui.current["Careers.fetch"];
    const localeChanged = locale !== prevProps.locale;

    if(assessmentReady && !existingRequest) {
      ui.trigger("Careers.fetch", {props}, {});
    } else if(assessmentReady && (assessmentChanged || localeChanged)) {
      abortExistingRequest();
      ui.trigger("Careers.fetching", {props}, false);
      ui.trigger("Careers.fetch", {props}, assessmentChanged ? {} : existingRequest);
    } else if(assessmentChanged || localeChanged) {
      abortExistingRequest();
      ui.trigger("Careers.fetching", {props}, false);
      ui.trigger("Careers.fetch", {props}, null);
    }
  });

  useEffect(() => {
    ui.trigger("Careers.fetching", {props}, false);
  }, [careers]);

  if(!isReady("results")) { return null; }

  return (
    <div className={style.container} ref={setElement}>
      {highlightedCareers.length > 0
        && <HighlightedCareers careers={highlightedCareers} {...props} />}
      {careers.map(({career, score}) => (
        <Career key={career.id} career={{score, ...career}} {...props} />
      ))}
      <div className={style.center}>
        {fetching && <span>{translate("loading")}</span>}
        {!fetching && (
          <>
            {moreCareers && (
              <button key="more" className={style.more} onClick={showMore} type="button">{translate("show_more")}</button>
            )}
            {careers.length === 0 && <span key="none">{translate("no_careers")}</span>}
            {careers.length > 0 && !moreCareers && <span key="done">{translate("no_more_careers")}</span>}
          </>
        )}
      </div>
    </div>
  );
}

CareerList.defaultProps = {options: null};
CareerList.propTypes = {
  assessmentID: PropTypes.string.isRequired,
  isReady: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  options: PropTypes.shape({
    careerOptions: PropTypes.shape({
      perPage: PropTypes.number
    })
  }),
  setElement: PropTypes.func.isRequired,
  traitify: TraitifyPropTypes.traitify.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {CareerList as Component};
export default withTraitify(CareerList);
