import useUpdateAssessment from "lib/hooks/requests/use-update-assessment";
import useHttp from "lib/hooks/use-http";

export default function useGraphqlUpdateAssessment({path, ...options}) {
  const http = useHttp();
  const {attempts, requesting, reset, trigger} = useUpdateAssessment(options);

  return {
    attempts,
    requesting,
    reset,
    trigger: ({assessment, query, variables}) => trigger({
      assessment,
      request: () => http.post({path, params: {query, variables}})
    })
  };
}
