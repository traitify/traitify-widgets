import {useRecoilValue} from "recoil";
import {activeState} from "lib/recoil";

export default function useActive() {
  return useRecoilValue(activeState);
}
