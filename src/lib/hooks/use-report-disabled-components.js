import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import {reportDisabledComponentsState} from "lib/recoil";

export default function useReportDisabledComponents(components) {
  const setReportDisabled = useSetRecoilState(reportDisabledComponentsState);

  useEffect(() => { setReportDisabled(components); }, [components]);
}
