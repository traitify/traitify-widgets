import dig from "lib/common/object/dig";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {optionsState} from "lib/recoil";

export default function useOption(...keys) {
  const options = useLoadedValue(optionsState);

  return dig(options, ...keys);
}
