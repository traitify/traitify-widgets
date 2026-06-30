import useSurvey from "lib/hooks/use-survey";

export default function useDeck() {
  return useSurvey({surveyType: "personality"});
}
