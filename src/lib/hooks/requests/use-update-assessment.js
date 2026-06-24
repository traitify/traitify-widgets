import {useRef, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher, useSetRecoilState} from "recoil";
import {errorsToText, getResponseErrors} from "lib/common/errors";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import {activeAssessmentQuery, appendErrorState} from "lib/recoil";

const RETRIES = 3;
const RETRY_DELAY = 2000;

export default function useUpdateAssessment({
  key, onFailure, onSuccess, parse, save = true, success
}) {
  const appendError = useSetRecoilState(appendErrorState);
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const refreshAssessment = useRecoilRefresher(activeAssessmentQuery);
  const [attempts, setAttempts] = useState(0);
  const requesting = useRef(false);

  const reset = () => setAttempts(0);

  const trigger = async({assessment, request}) => {
    if(!assessment) { return; }
    if(assessment.completedAt || assessment.completed || assessment.completed_at) { return; }
    if(attempts > RETRIES) { return; }
    if(requesting.current) { return; }

    requesting.current = true;

    const response = await request().catch((e) => ({errors: getResponseErrors(e)}));
    const fail = (data) => {
      console.warn(key, data); /* eslint-disable-line no-console */
      appendError(errorsToText(key, getResponseErrors(response)));
      requesting.current = false;
      setTimeout(() => setAttempts((x) => x + 1), RETRY_DELAY);
      if(attempts >= RETRIES) { onFailure?.(); }
    };

    if(response.errors) { return fail(response.errors); }

    const data = parse(response);
    if(!success(data)) { return fail(data); }

    onSuccess?.(data);
    save ? cache.set(assessmentCacheKey, data) : cache.remove(assessmentCacheKey);
    refreshAssessment();
    requesting.current = false;
  };

  return {attempts, requesting, reset, trigger};
}
