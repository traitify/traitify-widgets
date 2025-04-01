import useLoadedValue from "lib/hooks/use-loaded-value";
import {orderState} from "lib/recoil";

export default function useOrder() {
  return useLoadedValue(orderState);
}
