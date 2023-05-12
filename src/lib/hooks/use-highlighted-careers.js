import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {highlightedCareersState} from "lib/recoil";

export default function useHighlightedCareers() {
  const request = useRecoilValue(highlightedCareersState);
  const [state, setState] = useState({moreRecords: true, params: {}, records: []});

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
  }, [request.records]);

  return {...request, ...state};
}
