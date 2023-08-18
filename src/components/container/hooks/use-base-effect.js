import {useEffect} from "react";
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {
  assessmentsState,
  baseState,
  benchmarkIDState,
  packageIDState,
  profileIDState
} from "lib/recoil";
import useDidUpdate from "lib/hooks/use-did-update";

export default function useBaseEffect() {
  const resetAssessments = useResetRecoilState(assessmentsState);
  const base = useRecoilValue(baseState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setPackageID = useSetRecoilState(packageIDState);
  const setProfileID = useSetRecoilState(profileIDState);

  useEffect(() => { setBenchmarkID(base.benchmarkID); }, [base.benchmarkID]);
  useEffect(() => { setPackageID(base.packageID); }, [base.packageID]);
  useEffect(() => { setProfileID(base.profileID); }, [base.profileID]);
  useDidUpdate(() => { resetAssessments(); }, [base]);
}
