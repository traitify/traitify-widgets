import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {inlineJobsState} from "lib/recoil";

export default function useFetchInlineJobs(id) {
  const [jobs, setJobs] = useState({fetching: false, jobs: []});
  const request = useRecoilValue(inlineJobsState(id));

  useEffect(() => {
    setJobs(request);
  }, [request]);

  return jobs;
}
