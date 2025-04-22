import {useEffect} from "react";
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import useDidUpdate from "lib/hooks/use-did-update";
import {
  baseState,
  benchmarkIDState,
  orderIDState,
  orderState,
  packageIDState,
  profileIDState
} from "lib/recoil";

export default function useBaseEffect() {
  const resetOrder = useResetRecoilState(orderState);
  const base = useRecoilValue(baseState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setOrderID = useSetRecoilState(orderIDState);
  const setPackageID = useSetRecoilState(packageIDState);
  const setProfileID = useSetRecoilState(profileIDState);

  useEffect(() => { setBenchmarkID(base.benchmarkID); }, [base.benchmarkID]);
  useEffect(() => { setOrderID(base.orderID); }, [base.orderID]);
  useEffect(() => { setPackageID(base.packageID); }, [base.packageID]);
  useEffect(() => { setProfileID(base.profileID); }, [base.profileID]);
  useDidUpdate(() => { resetOrder(); }, [base]);
}
