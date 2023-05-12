import {useRecoilValue} from "recoil";
import {jobOptionsState} from "lib/recoil";

export default function useJobOptions() {
  return useRecoilValue(jobOptionsState);
}
