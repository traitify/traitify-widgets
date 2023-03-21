import {useCallback, useEffect, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {careersParamsState, careersState} from "lib/recoil";

export default function useCareers() {
  const request = useRecoilValue(careersState);
  const setParams = useSetRecoilState(careersParamsState);
  const [state, setState] = useState({moreRecords: true, params: {}, records: []});

  const getNextPage = useCallback(() => (
    setParams(({page, ...currentParams}) => ({...currentParams, page: page + 1}))
  ), []);

  useEffect(() => {
    if(!request.records) { return; }

    setState({
      moreRecords: request.records.length > 0
        && (request.records.length % request.params.careers_per_page) === 0,
      params: request.params,
      records: request.params.page === 1
        ? request.records
        : [...state.records, ...request.records]
    });
  }, [request.records]);

  return {...request, ...state, getNextPage};
}
