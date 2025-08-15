import PropTypes from "prop-types";
import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import mutable from "lib/common/object/mutable";
import {assessmentFromQuery} from "lib/common/order-from-query";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery, orderState} from "lib/recoil";

// NOTE: Syncs changes between assessments and order
function Assessment({id, surveyType}) {
  const latestAssessment = useLoadedValue(assessmentQuery({id, surveyType}));
  const setOrder = useSetRecoilState(orderState);

  useEffect(() => {
    if(!latestAssessment) { return; }

    setOrder((_order) => {
      const order = mutable(_order);
      const orderAssessment = order.assessments.find((a) => a.id === id);
      const {loaded} = orderAssessment;
      const assessment = assessmentFromQuery(latestAssessment);
      Object.keys(assessment).filter((key) => assessment[key] !== orderAssessment[key])
        .forEach((key) => { orderAssessment[key] = assessment[key]; });

      if(!loaded) {
        // NOTE: Claim the first survey missing an ID that matches the type
        const survey = order.surveys.filter((s) => !s.id)
          .find((s) => orderAssessment.surveyType === s.type);
        if(survey) { survey.id = orderAssessment.surveyID; }
      }

      return order;
    });
  }, [latestAssessment]);

  return null;
}

Assessment.propTypes = {
  id: PropTypes.string.isRequired,
  surveyType: PropTypes.string.isRequired
};

export default function DynamicState() {
  const order = useLoadedValue(orderState);

  return (order?.assessments || []).map(({id, surveyType}) => (
    <Assessment key={id} id={id} surveyType={surveyType} />
  ));
}
