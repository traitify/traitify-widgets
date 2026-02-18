import {useCallback} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import useActive from "lib/hooks/use-active";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useOrder from "lib/hooks/use-order";
import useSetting from "lib/hooks/use-setting";
import {orderState, skipDismissedState} from "lib/recoil";

export default function useSkipAssessment() {
  const active = useActive();
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const [dismissed, setDismissed] = useRecoilState(skipDismissedState);
  const graphQL = useGraphql();
  const http = useHttp();
  const order = useOrder();
  const setOrder = useSetRecoilState(orderState);

  const allow = useSetting("skipAssessmentAccommodation", {fallback: false});
  const dismiss = () => { setDismissed(true); };
  const trigger = useCallback(async() => {
    if(!active) { return; }
    if(!order) { return; }

    let success;
    const {assessmentID, benchmarkID, orderID, packageID, profileID} = order.origin;
    if(assessmentID || orderID) {
      switch(active.surveyType) {
        case "cognitive": {
          const query = {
            params: {
              query: graphQL.cognitive.skip,
              variables: {testID: active.id}
            },
            path: graphQL.cognitive.path
          };
          const response = await http.post(query);
          success = response.data.skipCognitiveTest.success;
          break;
        }
        case "external": {
          const query = {
            params: {
              query: graphQL.external.get,
              variables: {id: active.id}
            },
            path: graphQL.external.path
          };
          if(http.version === "v1") { query.version = graphQL.external.version; }
          const response = await http.post(query);
          success = response.data.skipAssessment.isSkipped;
          break;
        }
        case "generic": {
          const query = {
            params: {
              query: graphQL.generic.skip,
              variables: {assessmentID: active.id}
            },
            path: graphQL.generic.path
          };
          const response = await http.post(query);
          success = response.data.skipGenericAssessment.isSkipped;
          break;
        }
        default: {
          const query = {path: `/assessments/${active.id}/skip`};
          const response = await http.put(query);
          success = response.skipped;
        }
      }

      if(success) { cache.remove(assessmentCacheKey); }
    } else {
      const query = {
        params: {
          query: graphQL.xavier.skipRecommendation,
          variables: {benchmarkID, packageID, profileID}
        },
        path: graphQL.xavier.path
      };
      const response = await http.post(query);
      success = !!response.data.skipRecommendation.profileId;
    }
    if(!success) {
      console.warn("Error skipping assessment"); // eslint-disable-line no-console
      return;
    }

    setOrder((_order) => ({..._order, completed: true, status: "skipped"}));
  }, [active, order]);

  return {allow: dismissed ? false : allow, dismiss, trigger};
}
