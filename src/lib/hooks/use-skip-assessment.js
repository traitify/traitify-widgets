import {useCallback} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {errorsToText, getResponseErrors} from "lib/common/errors";
import useActive from "lib/hooks/use-active";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useOrder from "lib/hooks/use-order";
import useSetting from "lib/hooks/use-setting";
import {appendErrorState, orderState, skipDismissedState} from "lib/recoil";

const key = "skip-assessment";

export default function useSkipAssessment() {
  const active = useActive();
  const appendError = useSetRecoilState(appendErrorState);
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

    let request;
    const {assessmentID, benchmarkID, orderID, packageID, profileID} = order.origin;
    const hasAssessment = !!(assessmentID || orderID);
    if(hasAssessment) {
      switch(active.surveyType) {
        case "cognitive": {
          const query = {
            params: {
              query: graphQL.cognitive.skip,
              variables: {testID: active.id}
            },
            path: graphQL.cognitive.path
          };
          request = () => http.post(query);
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
          request = () => http.post(query);
          break;
        }
        case "generic": {
          const query = {
            params: {
              query: graphQL.generic.skip,
              variables: {id: active.id}
            },
            path: graphQL.generic.path
          };
          request = () => http.post(query);
          break;
        }
        case "rjp": {
          const query = {
            params: {
              query: graphQL.rjp.skip,
              variables: {id: active.id}
            },
            path: graphQL.rjp.path
          };
          request = () => http.post(query);
          break;
        }
        default: {
          const query = {path: `/assessments/${active.id}/skip`};
          request = () => http.put(query);
        }
      }
    } else {
      const query = {
        params: {
          query: graphQL.xavier.skipRecommendation,
          variables: {benchmarkID, packageID, profileID}
        },
        path: graphQL.xavier.path
      };
      request = () => http.post(query);
    }

    const response = await request().catch((e) => ({errors: getResponseErrors(e)}));
    if(response.errors) {
      console.warn(key, response.errors); // eslint-disable-line no-console
      appendError(errorsToText(key, getResponseErrors(response)));
      return;
    }

    if(hasAssessment) { cache.remove(assessmentCacheKey); }
    setOrder((_order) => ({..._order, completed: true, status: "skipped"}));
  }, [active, order]);

  return {allow: dismissed ? false : allow, dismiss, trigger};
}
