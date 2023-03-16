import useLoadedValue from "lib/hooks/use-loaded-value";
import {highlightedCareersQuery} from "lib/recoil";

export default function useHighlightedCareers() {
  // TODO: Search again if changes:
  //   const assessmentChanged = assessmentID !== prevProps.assessmentID;
  //   const localeChanged = locale !== prevProps.locale;

  return useLoadedValue(highlightedCareersQuery);
}
