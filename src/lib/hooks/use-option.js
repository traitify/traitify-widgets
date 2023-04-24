import useLoadedValue from "lib/hooks/use-loaded-value";
import {optionsState} from "lib/recoil";

export default function useOption(key) {
  const options = useLoadedValue(optionsState);

  return options ? options[key] : null;
}
