import {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {careerJobsState, jobsState} from "lib/recoil";

export default function useFetchModalJobs() {
  const setCareerModalJobs = useSetRecoilState(careerJobsState);
  const request = useRecoilValue(jobsState);

  useEffect(() => {
    setCareerModalJobs(request);
  }, [request]);
}
