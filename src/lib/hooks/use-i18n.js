import useLoadedValue from "lib/hooks/use-loaded-value";
import {i18nState} from "lib/recoil";

export default function useI18n() {
  return useLoadedValue(i18nState);
}
