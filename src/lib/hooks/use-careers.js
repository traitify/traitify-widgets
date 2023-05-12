import {useCallback, useEffect, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {careersParamsState, careersState, jobOptionsState} from "lib/recoil";

export default function useCareers() {
  const request = useRecoilValue(careersState);
  const setParams = useSetRecoilState(careersParamsState);
  const [state, setState] = useState({moreRecords: true, params: {}, records: []});
  const setJobOptions = useSetRecoilState(jobOptionsState);

  const getNextPage = useCallback(() => (
    setParams(({page, ...currentParams}) => ({...currentParams, page: page + 1}))
  ), []);

  useEffect(() => {
    if(!request.records) { return; }

    setState({
      moreRecords: request.records.careers.length > 0
        && (request.records.careers.length % request.params.careers_per_page) === 0,
      params: request.params,
      records: request.params.page === 1
        ? request.records.careers
        : [...state.records, ...request.records.careers]
    });

    setJobOptions(request?.records?.jobOptions || {});
  }, [request.records]);

  return {...request, ...state, getNextPage};
}
