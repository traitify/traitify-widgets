import useLoadedValue from "lib/hooks/use-loaded-value";
import {settingsQuery} from "lib/recoil";

export default function useSettings() {
  return useLoadedValue(settingsQuery);
}
