import useRecommendation from "lib/hooks/use-recommendation";
import useSetting from "lib/hooks/use-setting";

export default function useRedacted() {
  const recommendation = useRecommendation();
  const redactAfter = useSetting("redactRecommendationAfter");

  if(!redactAfter) { return false; }
  if(!recommendation?.created_at) { return false; }

  return Date.now() - recommendation.created_at > redactAfter;
}
