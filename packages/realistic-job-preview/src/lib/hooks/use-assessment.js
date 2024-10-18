import {useCallback} from "react";
import * as graphql from "lib/graphql/assessment";
import useCacheKey from "./use-cache-key";
import useDataRequest from "./use-data-request";
import useWidgetContext from "./use-widget-context";
import fixture from "../../../test/support/data/assessment.json";

const testing = true;
const createTestingData = ({id, localeKey}) => ({
  data: {realisticJobPreviewAssessment: {...fixture, localeKey, rjpId: id}}
});

export default function useAssessment() {
  const cacheKey = useCacheKey({type: "assessment"});
  const {assessmentID, cache, locale, http} = useWidgetContext();
  const request = useCallback(async() => {
    if(!cacheKey) { return; }

    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const params = {
      query: graphql.get,
      variables: {id: assessmentID, localeKey: locale}
    };
    const response = testing
      ? createTestingData(params.variables)
      : await http.post(graphql.path, params).catch((errors) => ({errors}));

    if(response.errors) {
      console.warn("test", response.errors); /* eslint-disable-line no-console */
      return;
    }

    const data = response.data.realisticJobPreviewAssessment;
    data.id = data.rjpId;
    if(data?.completedAt) { cache.set(cacheKey, data); }

    return data;
  }, [cacheKey]);

  return useDataRequest({key: cacheKey, request});
}
