import {useRecoilValue} from "recoil";
import {careerJobsState} from "lib/recoil";

export default function useJobs() {
  return useRecoilValue(careerJobsState);
}
