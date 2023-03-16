import useLoadedValue from "lib/hooks/use-loaded-value";
import {careersQuery} from "lib/recoil";

export default function useCareers() {
  // TODO: Search again if changes:
  //   const assessmentChanged = assessmentID !== prevProps.assessmentID;
  //   const localeChanged = locale !== prevProps.locale;

  return useLoadedValue(careersQuery);
}
