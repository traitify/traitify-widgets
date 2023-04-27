import useLoadedValue from "lib/hooks/use-loaded-value";
import {benchmarkQuery} from "lib/recoil";

export default function useBenchmark() {
  return useLoadedValue(benchmarkQuery);
}
