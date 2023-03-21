import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {highlightedCareersState} from "lib/recoil";

export default function useHighlightedCareers() {
  const request = useRecoilValue(highlightedCareersState);
  const [state, setState] = useState({moreRecords: true, params: {}, records: []});

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

  return {...request, ...state};
}
