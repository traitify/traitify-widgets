import useStartAssessment from "lib/hooks/requests/use-start-assessment";
import useHttp from "lib/hooks/use-http";

export default function useGraphqlStartAssessment({path, ...options}) {
  const http = useHttp();
  const {trigger} = useStartAssessment(options);

  return {
    trigger: ({assessment, query, variables}) => trigger({
      assessment,
      request: () => http.post({path, params: {query, variables}})
    })
  };
}
