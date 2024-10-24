import {useCallback} from "react";
import * as graphql from "lib/graphql/assessment";
import useCacheKey from "./use-cache-key";
import useDataRequest from "./use-data-request";
import useWidgetContext from "./use-widget-context";

export default function useAssessment() {
  const cacheKey = useCacheKey({type: "assessment"});
  const {assessmentID, cache, locale, http} = useWidgetContext();
  const request = useCallback(async() => {
    if(!cacheKey) { return; }

    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const params = {
      query: graphql.get,
      variables: {assessmentID, localeKey: locale}
    };
    const response = await http.post(graphql.path, params).catch((errors) => ({errors}));
    if(response.errors) {
      console.warn("assessment", response.errors); /* eslint-disable-line no-console */
      return;
    }

    const data = response.data.assessment;
    if(data?.completedAt) { cache.set(cacheKey, data); }

    return data;
  }, [cacheKey]);

  return useDataRequest({key: cacheKey, request});
}
