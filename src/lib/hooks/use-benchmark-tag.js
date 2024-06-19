import {useRecoilValue} from "recoil";
import {benchmarkTagState} from "lib/recoil";

export default function useBenchmark() {
  return useRecoilValue(benchmarkTagState);
}
