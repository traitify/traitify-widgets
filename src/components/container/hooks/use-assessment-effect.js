import {useEffect} from "react";
import {useRecoilCallback} from "recoil";
import mutable from "lib/common/object/mutable";
import {assessmentFromQuery} from "lib/common/order-from-query";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery, orderState} from "lib/recoil";

export default function useAssessmentEffect() {
  const order = useLoadedValue(orderState);
  const assessments = (order?.assessments || []);

  // NOTE: Sync assessment updates to order
  const followAssessment = useRecoilCallback(
    ({set, snapshot}) => (
      async({id, surveyType}) => (
        snapshot.getPromise(assessmentQuery({id, surveyType})).then((latestAssessment) => {
          console.log("promise me", latestAssessment);
          if(!latestAssessment) { return; }

          set(orderState, (_latestOrder) => {
            const latestOrder = mutable(_latestOrder);
            const assessment = latestOrder.assessments.find((a) => a.id === id);
            const {loaded} = assessment;
            Object.assign(assessment, assessmentFromQuery(latestAssessment));

            if(!loaded) {
              // NOTE: Claim the first survey missing an ID that matches the type
              const survey = latestOrder.surveys.filter((s) => !s.id)
                .find((s) => assessment.surveyType === s.type);
              if(survey) { survey.id = assessment.surveyID; }
            }

            return latestOrder;
          });
        })
      )
    ),
    []
  );

  useEffect(() => {
    assessments.forEach(({id, surveyType}) => {
      followAssessment({id, surveyType});
    });
  }, [assessments.map(({id}) => id).join(" ")]);
}
