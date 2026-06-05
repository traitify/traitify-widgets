import PropTypes from "prop-types";
import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import mutable from "lib/common/object/mutable";
import {assessmentFromQuery} from "lib/common/order-from-query";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery, orderState} from "lib/recoil";

// NOTE: Syncs changes between assessments and order
// - Also rehydrates assessment if base order changes
function Assessment({id, loaded = false, surveyType}) {
  const latestAssessment = useLoadedValue(assessmentQuery({id, surveyType}));
  const setOrder = useSetRecoilState(orderState);

  useEffect(() => {
    if(!latestAssessment) { return; }

    setOrder((_order) => {
      if(!_order) { return _order; }
      const order = mutable(_order);
      const orderAssessment = order.assessments.find((a) => a.id === id);
      if(!orderAssessment) { return _order; }

      const assessment = assessmentFromQuery(latestAssessment);
      const diffs = Object.keys(assessment)
        .filter((key) => assessment[key] !== orderAssessment[key]);
      const claimSurveyIndex = orderAssessment.loaded
        ? -1
        : order.surveys.findIndex((s) => !s.id && s.type === orderAssessment.surveyType);
      if(diffs.length === 0 && claimSurveyIndex === -1) { return _order; }

      diffs.forEach((key) => { orderAssessment[key] = assessment[key]; });

      if(claimSurveyIndex !== -1) {
        order.surveys[claimSurveyIndex].id = orderAssessment.surveyID;
      }

      return order;
    });
  }, [latestAssessment, loaded]);

  return null;
}

Assessment.propTypes = {
  id: PropTypes.string.isRequired,
  loaded: PropTypes.bool,
  surveyType: PropTypes.string.isRequired
};

export default function DynamicState() {
  const order = useLoadedValue(orderState);

  return (order?.assessments || []).map(({id, loaded, surveyType}) => (
    <Assessment key={id} id={id} loaded={loaded} surveyType={surveyType} />
  ));
}
